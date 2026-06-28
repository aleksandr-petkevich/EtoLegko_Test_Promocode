import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from '../database/database.module';
import { PromocodeController } from './promocode.controller';
import { PromocodeService } from './promocode.service';
import { PromocodeSchema } from './schemas/promocode.schema';
import { UsageSchema } from './schemas/usage.schema';
import { PromocodeEventHandler } from './promocode-event.handler';
import { UsageController } from './usage.controller';
import { UsageService } from './usage.service';

const CommandHandlers = [];
const QueryHandlers = [];

@Module({
    imports: [
        CqrsModule,
        MongooseModule.forFeature([{ name: 'Promocode', schema: PromocodeSchema }]),
        MongooseModule.forFeature([{ name: 'Usage', schema: UsageSchema }]),
        DatabaseModule,
    ],
    controllers: [PromocodeController, UsageController],
    providers: [PromocodeService, UsageService, PromocodeEventHandler, ...CommandHandlers, ...QueryHandlers],
})
export class PromocodesModule { }
