import { OnModuleInit } from '@nestjs/common';
export declare class ClickHouseService implements OnModuleInit {
    private client;
    onModuleInit(): void;
    insertPromocode(data: any): Promise<void>;
    updatePromocode(id: string, data: any): Promise<void>;
    deletePromocode(id: string): Promise<void>;
    getPromocodes(filters?: any): Promise<any>;
    getAnalytics(): Promise<{
        usageByDay: any;
        topPromocodes: any;
        statusDistribution: any;
        conversionRate: {
            used_count: any;
            total_count: any;
        };
    }>;
    private getUsageByDay;
    private getTopPromocodes;
    private getStatusDistribution;
    private getConversionRate;
}
