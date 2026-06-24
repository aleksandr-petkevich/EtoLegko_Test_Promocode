import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from '../database/database.module';
import { PromocodeController } from './promocode.controller';
import { PromocodeService } from './promocode.service';
import { PromocodeSchema } from './schemas/promocode.schema';
import { PromocodeEventHandler } from './promocode-event.handler';

const CommandHandlers = [];
const QueryHandlers = [];

@Module({
    imports: [
        CqrsModule,
        MongooseModule.forFeature([{ name: 'Promocode', schema: PromocodeSchema }]),
        DatabaseModule,
    ],
    controllers: [PromocodeController],
    providers: [PromocodeService, PromocodeEventHandler, ...CommandHandlers, ...QueryHandlers],
})
export class PromocodesModule { }