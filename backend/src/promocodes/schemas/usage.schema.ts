import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsageDocument = Usage & Document;

@Schema({ timestamps: true })
export class Usage {
    @Prop({ required: true })
    promocode_id: string;

    @Prop({ required: true })
    promocode_code: string;

    @Prop({ required: true })
    used_at: Date;

    @Prop({ required: true, min: 0, default: 1 })
    usage_count: number;

    @Prop({ required: false })
    user_id?: string;

    @Prop({ required: false })
    comment?: string;
}

export const UsageSchema = SchemaFactory.createForClass(Usage);