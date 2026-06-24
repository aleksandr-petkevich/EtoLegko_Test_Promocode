"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClickHouseService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@clickhouse/client");
let ClickHouseService = class ClickHouseService {
    onModuleInit() {
        this.client = (0, client_1.createClient)({
            host: 'http://localhost:8123',
            username: 'default',
            password: '',
            database: 'promocode_analytics',
        });
    }
    async insertPromocode(data) {
        await this.client.insert({
            table: 'promocodes',
            values: [data],
            format: 'JSONEachRow',
        });
    }
    async updatePromocode(id, data) {
        await this.client.insert({
            table: 'promocodes',
            values: [{ ...data, id }],
            format: 'JSONEachRow',
        });
    }
    async deletePromocode(id) {
        if (!id) {
            console.error('Cannot delete promocode: id is undefined');
            return;
        }
        const query = `ALTER TABLE promocodes DELETE WHERE id = '${id}'`;
        await this.client.command(query);
    }
    async getPromocodes(filters = {}) {
        let query = 'SELECT * FROM promocodes WHERE 1=1';
        const params = {};
        if (filters.code) {
            query += " AND code LIKE @code";
            params.code = `%${filters.code}%`;
        }
        if (filters.status) {
            query += " AND status = @status";
            params.status = filters.status;
        }
        if (filters.discount_type) {
            query += " AND discount_type = @discount_type";
            params.discount_type = filters.discount_type;
        }
        const result = await this.client.query({
            query,
            format: 'JSONEachRow',
            query_params: params,
        });
        return result.json();
    }
    async getAnalytics() {
        try {
            const [usageByDay, topPromocodes, statusDistribution, conversionRate] = await Promise.all([
                this.getUsageByDay(),
                this.getTopPromocodes(),
                this.getStatusDistribution(),
                this.getConversionRate(),
            ]);
            return {
                usageByDay,
                topPromocodes,
                statusDistribution,
                conversionRate,
            };
        }
        catch (error) {
            console.error('Failed to fetch analytics from ClickHouse:', error);
            return {
                usageByDay: [],
                topPromocodes: [],
                statusDistribution: [],
                conversionRate: { used_count: 0, total_count: 0 },
            };
        }
    }
    async getUsageByDay() {
        const result = await this.client.query({
            query: `
        SELECT toDate(used_at) as date, count(*) as usage_count
        FROM promocode_usage
        WHERE used_at >= now() - INTERVAL 30 DAY
        GROUP BY date
        ORDER BY date
      `,
            format: 'JSONEachRow',
        });
        return result.json();
    }
    async getTopPromocodes() {
        const result = await this.client.query({
            query: `
        SELECT promocode_code, count(*) as usage_count
        FROM promocode_usage
        GROUP BY promocode_code
        ORDER BY usage_count DESC
        LIMIT 5
      `,
            format: 'JSONEachRow',
        });
        return result.json();
    }
    async getStatusDistribution() {
        const result = await this.client.query({
            query: `
        SELECT status, count(*) as count
        FROM promocodes
        GROUP BY status
      `,
            format: 'JSONEachRow',
        });
        return result.json();
    }
    async getConversionRate() {
        const [usageResult, totalResult] = await Promise.all([
            this.client.query({
                query: 'SELECT count(DISTINCT promocode_id) as used_count FROM promocode_usage',
                format: 'JSONEachRow',
            }),
            this.client.query({
                query: 'SELECT count(*) as total_count FROM promocodes',
                format: 'JSONEachRow',
            }),
        ]);
        const usageData = await usageResult.json();
        const totalData = await totalResult.json();
        return {
            used_count: usageData[0]?.used_count || 0,
            total_count: totalData[0]?.total_count || 0,
        };
    }
};
exports.ClickHouseService = ClickHouseService;
exports.ClickHouseService = ClickHouseService = __decorate([
    (0, common_1.Injectable)()
], ClickHouseService);
//# sourceMappingURL=clickhouse.service.js.map