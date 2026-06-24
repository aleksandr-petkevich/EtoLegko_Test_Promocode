import { ClickHouseService } from '../database/clickhouse.service';
export declare class PromocodeEventHandler {
    private clickHouseService;
    constructor(clickHouseService: ClickHouseService);
    handlePromocodeCreated(payload: any): Promise<void>;
    handlePromocodeUpdated(payload: any): Promise<void>;
    handlePromocodeDeleted(payload: {
        id: string;
    }): Promise<void>;
}
