import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient } from '@clickhouse/client';

@Injectable()
export class ClickHouseService implements OnModuleInit {
    private client;

    async onModuleInit() {
        this.client = createClient({
            host: 'http://localhost:8123',
            username: 'default',
            password: '',
            database: 'promocode_analytics',
        });
    }

    async insertPromocode(data: any) {
        await this.client.insert({
            table: 'promocodes',
            values: [data],
            format: 'JSONEachRow',
        });
    }

    async updatePromocode(id: string, data: any) {
        await this.client.insert({
            table: 'promocodes',
            values: [{ ...data, id }],
            format: 'JSONEachRow',
        });
    }

    async deletePromocode(id: string) {
        if (!id) {
            console.error('Cannot delete promocode: id is undefined');
            return;
        }
        const query = `ALTER TABLE promocodes DELETE WHERE id = '${id}'`;
        await this.client.command(query);
    }

    async insertUsage(data: any) {
        console.log('Inserting usage into ClickHouse:', data);
        await this.client.insert({
            table: 'promocode_usage',
            values: [data],
            format: 'JSONEachRow',
        });
        console.log('Successfully inserted usage into ClickHouse');
    }

    async getPromocodes(filters: any = {}) {
        let query = 'SELECT * FROM promocodes WHERE 1=1';
        const params: any = {};

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
        } catch (error) {
            console.error('Failed to fetch analytics from ClickHouse:', error);
            return {
                usageByDay: [],
                topPromocodes: [],
                statusDistribution: [],
                conversionRate: { used_count: 0, total_count: 0 },
            };
        }
    }

    private async getUsageByDay() {
        console.log('Fetching usage by day from ClickHouse');
        const result = await this.client.query({
            query: `
        SELECT 
            d.date,
            sum(u.usage_count) as usage_count
        FROM (
            SELECT toDate(now() - INTERVAL number DAY) as date
            FROM numbers(30)
        ) d
        LEFT JOIN promocode_usage u ON toDate(u.used_at) = d.date
        GROUP BY d.date
        ORDER BY d.date
      `,
            format: 'JSONEachRow',
        });
        const data = await result.json();
        console.log('Usage by day data:', data);
        return data;
    }

    private async getTopPromocodes() {
        console.log('Fetching top promocodes from ClickHouse');
        const result = await this.client.query({
            query: `
        SELECT promocode_code, sum(usage_count) as usage_count
        FROM promocode_usage
        GROUP BY promocode_code
        ORDER BY usage_count DESC
        LIMIT 5
      `,
            format: 'JSONEachRow',
        });
        const data = await result.json();
        console.log('Top promocodes data:', data);
        return data;
    }

    private async getStatusDistribution() {
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

    private async getConversionRate() {
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
}