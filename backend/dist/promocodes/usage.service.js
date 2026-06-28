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
exports.UsageService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const usage_schema_1 = require("./schemas/usage.schema");
const promocode_schema_1 = require("./schemas/promocode.schema");
const clickhouse_service_1 = require("../database/clickhouse.service");
const dayjs_1 = __importDefault(require("dayjs"));
let UsageService = class UsageService {
    constructor(usageModel, promocodeModel, clickHouseService) {
        this.usageModel = usageModel;
        this.promocodeModel = promocodeModel;
        this.clickHouseService = clickHouseService;
    }
    async create(createUsageDto) {
        const { promocode_id, promocode_code, used_at, usage_count = 1, user_id, comment } = createUsageDto;
        let promocode = await this.promocodeModel.findOne({ id: promocode_id }).exec();
        if (!promocode) {
            promocode = await this.promocodeModel.findById(promocode_id).exec();
        }
        if (!promocode) {
            promocode = await this.promocodeModel.findOne({ code: promocode_id }).exec();
        }
        if (!promocode) {
            console.error('Promocode not found. Searched with:', {
                promocode_id,
                type: typeof promocode_id,
                totalPromocodes: await this.promocodeModel.countDocuments().exec()
            });
            throw new common_1.ConflictException('Промокод не найден');
        }
        const usage = new this.usageModel({
            promocode_id,
            promocode_code: promocode.code,
            used_at: new Date(used_at),
            usage_count,
            user_id,
            comment,
        });
        const savedUsage = await usage.save();
        await this.promocodeModel.findByIdAndUpdate(promocode._id, {
            $inc: { usage_count: usage_count }
        }).exec();
        const clickHouseData = {
            id: savedUsage.id,
            promocode_id: savedUsage.promocode_id,
            promocode_code: savedUsage.promocode_code,
            used_at: (0, dayjs_1.default)(savedUsage.used_at).format('YYYY-MM-DD HH:mm:ss'),
            usage_count: usage_count,
            order_amount: 0,
            discount_applied: 0,
        };
        await this.clickHouseService.insertUsage(clickHouseData);
        return savedUsage;
    }
    async findAll(filters = {}) {
        const { page = 1, limit = 10, ...restFilters } = filters;
        const skip = (page - 1) * limit;
        const query = {};
        if (restFilters.promocode_id)
            query.promocode_id = restFilters.promocode_id;
        if (restFilters.promocode_code)
            query.promocode_code = { $regex: restFilters.promocode_code, $options: 'i' };
        if (restFilters.user_id)
            query.user_id = restFilters.user_id;
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
    async findOne(id) {
        const usage = await this.usageModel.findOne({ id }).exec();
        if (!usage) {
            return this.usageModel.findById(id).exec();
        }
        return usage;
    }
};
exports.UsageService = UsageService;
exports.UsageService = UsageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(usage_schema_1.Usage.name)),
    __param(1, (0, mongoose_1.InjectModel)(promocode_schema_1.Promocode.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        clickhouse_service_1.ClickHouseService])
], UsageService);
//# sourceMappingURL=usage.service.js.map