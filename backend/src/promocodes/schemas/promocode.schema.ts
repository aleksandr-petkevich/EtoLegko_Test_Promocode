import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PromocodeDocument = Promocode & Document;

@Schema({ timestamps: true })
export class Promocode {
    @Prop({ required: true, unique: true })
    id: string;

    @Prop({ required: true, unique: true })
    code: string;

    @Prop({ required: true, enum: ['percentage', 'fixed'] })
    discount_type: string;

    @Prop({ required: true, min: 0 })
    discount_value: number;

    @Prop({ required: true })
    valid_until: Date;

    @Prop({ required: true, min: 0, default: 1 })
    usage_limit: number;

    @Prop({ required: true, min: 0, default: 0 })
    usage_count: number;

    @Prop({ required: true, enum: ['active', 'expired', 'disabled'], default: 'active' })
    status: string;

    createdAt: Date;
    updatedAt: Date;
}

export const PromocodeSchema = SchemaFactory.createForClass(Promocode);