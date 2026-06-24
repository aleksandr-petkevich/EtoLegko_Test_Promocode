import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClickHouseService } from '../database/clickhouse.service';
import { Promocode, PromocodeDocument } from './schemas/promocode.schema';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

@Injectable()
export class PromocodeService {
    constructor(
        @InjectModel(Promocode.name) private promocodeModel: Model<PromocodeDocument>,
        private clickHouseService: ClickHouseService,
    ) { }

    async findAll(filters: any = {}) {
        const { page = 1, limit = 10, sort = '-created_at', ...restFilters } = filters;
        const skip = (page - 1) * limit;

        const query: any = {};
        if (restFilters.code) query.code = { $regex: restFilters.code, $options: 'i' };
        if (restFilters.status) query.status = restFilters.status;
        if (restFilters.discount_type) query.discount_type = restFilters.discount_type;

        const [data, total] = await Promise.all([
            this.promocodeModel.find(query).sort(sort).skip(skip).limit(parseInt(limit)).exec(),
            this.promocodeModel.countDocuments(query),
        ]);

        const dataWithId = data.map(item => {
            const obj = item.toObject();
            return {
                ...obj,
                id: obj.id || (obj._id ? obj._id.toString() : undefined),
            };
        });

        return {
            data: dataWithId,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
        };
    }

    async findOne(id: string) {
        const promocode = await this.promocodeModel.findOne({ id }).exec();
        if (!promocode) {
            // Try to find by _id if not found by custom id
            return this.promocodeModel.findById(id).exec();
        }
        return promocode;
    }

    async create(createPromocodeDto: any) {
        const id = uuidv4();
        const now = new Date();

        const promocode = new this.promocodeModel({
            id,
            ...createPromocodeDto,
            usage_count: 0,
        });

        let saved;
        try {
            saved = await promocode.save();
        } catch (error: any) {
            if (error.code === 11000) {
                throw new ConflictException('Промокод с таким кодом уже существует');
            }
            throw error;
        }

        const clickHouseData = {
            id: saved.id,
            code: saved.code,
            discount_type: saved.discount_type,
            discount_value: saved.discount_value,
            valid_until: dayjs(saved.valid_until).format('YYYY-MM-DD HH:mm:ss'),
            usage_limit: saved.usage_limit,
            usage_count: saved.usage_count,
            status: saved.status,
            created_at: dayjs(now).format('YYYY-MM-DD HH:mm:ss'),
            updated_at: dayjs(now).format('YYYY-MM-DD HH:mm:ss'),
        };

        await this.clickHouseService.insertPromocode(clickHouseData);

        return saved;
    }

    async update(id: string, updatePromocodeDto: any) {
        const updated = await this.promocodeModel.findByIdAndUpdate(id, updatePromocodeDto, { new: true }).exec();

        if (updated) {
            const now = new Date();
            const clickHouseData = {
                id: updated.id,
                code: updated.code,
                discount_type: updated.discount_type,
                discount_value: updated.discount_value,
                valid_until: dayjs(updated.valid_until).format('YYYY-MM-DD HH:mm:ss'),
                usage_limit: updated.usage_limit,
                usage_count: updated.usage_count,
                status: updated.status,
                created_at: dayjs(updated.createdAt).format('YYYY-MM-DD HH:mm:ss'),
                updated_at: dayjs(now).format('YYYY-MM-DD HH:mm:ss'),
            };

            await this.clickHouseService.updatePromocode(updated.id, clickHouseData);
        }

        return updated;
    }

    async remove(id: string) {
        // Try to find by custom id field first
        let deleted = await this.promocodeModel.findOneAndDelete({ id: id }).exec();

        // If not found by custom id, try by MongoDB _id (for backward compatibility)
        if (!deleted) {
            deleted = await this.promocodeModel.findByIdAndDelete(id).exec();
        }

        if (deleted) {
            try {
                await this.clickHouseService.deletePromocode(id);
            } catch (error) {
                console.error('Failed to delete from ClickHouse:', error);
                // Continue anyway - MongoDB is the source of truth
            }
        }
        return deleted ? true : null;
    }

    async getAnalytics() {
        const [clickhouseAnalytics, totalCount, activeCount, statusDistribution] = await Promise.all([
            this.clickHouseService.getAnalytics(),
            this.promocodeModel.countDocuments(),
            this.promocodeModel.countDocuments({ status: 'active' }),
            this.promocodeModel.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } },
                { $project: { status: '$_id', count: 1, _id: 0 } },
            ]).exec(),
        ]);

        return {
            ...clickhouseAnalytics,
            totalCount,
            activeCount,
            statusDistribution: statusDistribution as { status: string; count: number }[],
        };
    }
}