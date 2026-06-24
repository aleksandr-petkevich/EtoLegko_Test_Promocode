import { Document } from 'mongoose';
export type PromocodeDocument = Promocode & Document;
export declare class Promocode {
    code: string;
    discount_type: string;
    discount_value: number;
    valid_until: Date;
    usage_limit: number;
    usage_count: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const PromocodeSchema: import("mongoose").Schema<Promocode, import("mongoose").Model<Promocode, any, any, any, Document<unknown, any, Promocode, any, {}> & Promocode & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Promocode, Document<unknown, {}, import("mongoose").FlatRecord<Promocode>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Promocode> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
