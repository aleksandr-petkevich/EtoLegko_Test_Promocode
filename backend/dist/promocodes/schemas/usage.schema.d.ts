import { Document } from 'mongoose';
export type UsageDocument = Usage & Document;
export declare class Usage {
    promocode_id: string;
    promocode_code: string;
    used_at: Date;
    usage_count: number;
    user_id?: string;
    comment?: string;
}
export declare const UsageSchema: import("mongoose").Schema<Usage, import("mongoose").Model<Usage, any, any, any, Document<unknown, any, Usage, any, {}> & Usage & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Usage, Document<unknown, {}, import("mongoose").FlatRecord<Usage>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Usage> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
