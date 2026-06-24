"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromocodeService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const clickhouse_service_1 = require("../database/clickhouse.service");
const promocode_schema_1 = require("./schemas/promocode.schema");
const uuid_1 = require("uuid");
const dayjs_1 = __importDefault(require("dayjs"));
let PromocodeService = class PromocodeService {
    constructor(promocodeModel, clickHouseService) {
        this.promocodeModel = promocodeModel;
        this.clickHouseService = clickHouseService;
    }
    async findAll(filters = {}) {
        const { page = 1, limit = 10, sort = '-created_at', ...restFilters } = filters;
        const skip = (page - 1) * limit;
        const query = {};
        if (restFilters.code)
            query.code = { $regex: restFilters.code, $options: 'i' };
        if (restFilters.status)
            query.status = restFilters.status;
        if (restFilters.discount_type)
            query.discount_type = restFilters.discount_type;
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
    async findOne(id) {
        const promocode = await this.promocodeModel.findOne({ id }).exec();
        if (!promocode) {
            return this.promocodeModel.findById(id).exec();
        }
        return promocode;
    }
    async create(createPromocodeDto) {
        const id = (0, uuid_1.v4)();
        const now = new Date();
        const promocode = new this.promocodeModel({
            id,
            ...createPromocodeDto,
            usage_count: 0,
        });
        let saved;
        try {
            saved = await promocode.save();
        }
        catch (error) {
            if (error.code === 11000) {
                throw new common_1.ConflictException('Промокод с таким кодом уже существует');
            }
            throw error;
        }
        const clickHouseData = {
            id: saved.id,
            code: saved.code,
            discount_type: saved.discount_type,
            discount_value: saved.discount_value,
            valid_until: (0, dayjs_1.default)(saved.valid_until).format('YYYY-MM-DD HH:mm:ss'),
            usage_limit: saved.usage_limit,
            usage_count: saved.usage_count,
            status: saved.status,
            created_at: (0, dayjs_1.default)(now).format('YYYY-MM-DD HH:mm:ss'),
            updated_at: (0, dayjs_1.default)(now).format('YYYY-MM-DD HH:mm:ss'),
        };
        await this.clickHouseService.insertPromocode(clickHouseData);
        return saved;
    }
    async update(id, updatePromocodeDto) {
        const updated = await this.promocodeModel.findByIdAndUpdate(id, updatePromocodeDto, { new: true }).exec();
        if (updated) {
            const now = new Date();
            const clickHouseData = {
                id: updated.id,
                code: updated.code,
                discount_type: updated.discount_type,
                discount_value: updated.discount_value,
                valid_until: (0, dayjs_1.default)(updated.valid_until).format('YYYY-MM-DD HH:mm:ss'),
                usage_limit: updated.usage_limit,
                usage_count: updated.usage_count,
                status: updated.status,
                created_at: (0, dayjs_1.default)(updated.createdAt).format('YYYY-MM-DD HH:mm:ss'),
                updated_at: (0, dayjs_1.default)(now).format('YYYY-MM-DD HH:mm:ss'),
            };
            await this.clickHouseService.updatePromocode(updated.id, clickHouseData);
        }
        return updated;
    }
    async remove(id) {
        let deleted = await this.promocodeModel.findOneAndDelete({ id: id }).exec();
        if (!deleted) {
            deleted = await this.promocodeModel.findByIdAndDelete(id).exec();
        }
        if (deleted) {
            try {
                await this.clickHouseService.deletePromocode(id);
            }
            catch (error) {
                console.error('Failed to delete from ClickHouse:', error);
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
            statusDistribution: statusDistribution,
        };
    }
};
exports.PromocodeService = PromocodeService;
exports.PromocodeService = PromocodeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(promocode_schema_1.Promocode.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        clickhouse_service_1.ClickHouseService])
], PromocodeService);
//# sourceMappingURL=promocode.service.js.map