import { UsageService } from './usage.service';
export declare class UsageController {
    private readonly usageService;
    constructor(usageService: UsageService);
    create(createUsageDto: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/usage.schema").UsageDocument, {}, {}> & import("./schemas/usage.schema").Usage & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAll(filters: any): Promise<{
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
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/usage.schema").UsageDocument, {}, {}> & import("./schemas/usage.schema").Usage & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
