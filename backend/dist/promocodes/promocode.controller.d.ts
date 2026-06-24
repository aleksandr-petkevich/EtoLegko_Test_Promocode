import { PromocodeService } from './promocode.service';
export declare class PromocodeController {
    private readonly promocodeService;
    constructor(promocodeService: PromocodeService);
    findAll(filters: any): Promise<{
        data: {
            id: any;
            code: string;
            discount_type: string;
            discount_value: number;
            valid_until: Date;
            usage_limit: number;
            usage_count: number;
            status: string;
            createdAt: Date;
            updatedAt: Date;
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
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/promocode.schema").PromocodeDocument, {}, {}> & import("./schemas/promocode.schema").Promocode & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    create(createPromocodeDto: any): Promise<any>;
    update(id: string, updatePromocodeDto: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/promocode.schema").PromocodeDocument, {}, {}> & import("./schemas/promocode.schema").Promocode & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    getAnalytics(): Promise<{
        totalCount: number;
        activeCount: number;
        statusDistribution: {
            status: string;
            count: number;
        }[];
        usageByDay: any;
        topPromocodes: any;
        conversionRate: {
            used_count: any;
            total_count: any;
        };
    }>;
}
