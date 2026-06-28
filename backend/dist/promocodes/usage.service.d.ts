import { Model } from 'mongoose';
import { Usage, UsageDocument } from './schemas/usage.schema';
import { PromocodeDocument } from './schemas/promocode.schema';
import { ClickHouseService } from '../database/clickhouse.service';
export declare class UsageService {
    private usageModel;
    private promocodeModel;
    private clickHouseService;
    constructor(usageModel: Model<UsageDocument>, promocodeModel: Model<PromocodeDocument>, clickHouseService: ClickHouseService);
    create(createUsageDto: any): Promise<import("mongoose").Document<unknown, {}, UsageDocument, {}, {}> & Usage & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAll(filters?: any): Promise<{
        data: {
            id: any;
            promocode_id: string;
            promocode_code: string;
            used_at: Date;
            usage_count: number;
            user_id?: string;
            comment?: string;
            _id: import("mongoose").Types.ObjectId;
            $locals: Record<string, unknown>;
            $op: "save" | "validate" | "remove" | null;
            $where: Record<string, unknown>;
            baseModelName?: string;
            collection: import("mongoose").Collection;
            db: import("mongoose").Connection;
            errors?: import("mongoose").Error.ValidationError;
            isNew: boolean;
            schema: import("mongoose").Schema;
            __v: number;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, UsageDocument, {}, {}> & Usage & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
