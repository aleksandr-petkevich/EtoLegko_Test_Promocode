import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usage, UsageDocument } from './schemas/usage.schema';
import { Promocode, PromocodeDocument } from './schemas/promocode.schema';
import { ClickHouseService } from '../database/clickhouse.service';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

@Injectable()
export class UsageService {
    constructor(
        @InjectModel(Usage.name) private usageModel: Model<UsageDocument>,
        @InjectModel(Promocode.name) private promocodeModel: Model<PromocodeDocument>,
        private clickHouseService: ClickHouseService,
    ) { }

    async create(createUsageDto: any) {
        const { promocode_id, promocode_code, used_at, usage_count = 1, user_id, comment } = createUsageDto;

        // Validate promocode exists
        let promocode = await this.promocodeModel.findOne({ id: promocode_id }).exec();
        if (!promocode) {
            // Try to find by _id if not found by custom id (for backward compatibility)
            promocode = await this.promocodeModel.findById(promocode_id).exec();
        }
        if (!promocode) {
            // Try to find by code as last resort
            promocode = await this.promocodeModel.findOne({ code: promocode_id }).exec();
        }
        if (!promocode) {
            // Log for debugging
            console.error('Promocode not found. Searched with:', {
                promocode_id,
                type: typeof promocode_id,
                totalPromocodes: await this.promocodeModel.countDocuments().exec()
            });
            throw new ConflictException('Промокод не найден');
        }

        // Create usage record
        const usage = new this.usageModel({
            promocode_id,
            promocode_code: promocode.code,
            used_at: new Date(used_at),
            usage_count,
            user_id,
            comment,
        });

        const savedUsage = await usage.save();

        // Update promocode usage count
        await this.promocodeModel.findByIdAndUpdate(promocode._id, {
            $inc: { usage_count: usage_count }
        }).exec();

        // Save to ClickHouse for analytics
        const clickHouseData = {
            id: savedUsage.id,
            promocode_id: savedUsage.promocode_id,
            promocode_code: savedUsage.promocode_code,
            used_at: dayjs(savedUsage.used_at).format('YYYY-MM-DD HH:mm:ss'),
            usage_count: usage_count,
            order_amount: 0, // Manual entry, no order amount
            discount_applied: 0, // Manual entry, no discount amount
        };

        await this.clickHouseService.insertUsage(clickHouseData);

        return savedUsage;
    }

    async findAll(filters: any = {}) {
        const { page = 1, limit = 10, ...restFilters } = filters;
        const skip = (page - 1) * limit;

        const query: any = {};
        if (restFilters.promocode_id) query.promocode_id = restFilters.promocode_id;
        if (restFilters.promocode_code) query.promocode_code = { $regex: restFilters.promocode_code, $options: 'i' };
        if (restFilters.user_id) query.user_id = restFilters.user_id;
        if (restFilters.used_at) {
            const date = new Date(restFilters.used_at);
            query.used_at = {
                $gte: new Date(date.setHours(0, 0, 0)),
                $lt: new Date(date.setHours(23, 59, 59)),
            };
        }

        const [data, total] = await Promise.all([
            this.usageModel.find(query).sort({ used_at: -1 }).skip(skip).limit(parseInt(limit)).exec(),
            this.usageModel.countDocuments(query),
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
        const usage = await this.usageModel.findOne({ id }).exec();
        if (!usage) {
            return this.usageModel.findById(id).exec();
        }
        return usage;
    }
}