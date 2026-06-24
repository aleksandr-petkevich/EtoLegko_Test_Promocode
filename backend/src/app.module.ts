import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PromocodesModule } from './promocodes/promocodes.module';
import { DatabaseModule } from './database/database.module';

@Module({
    imports: [
        DatabaseModule,
        MongooseModule.forRoot('mongodb://admin:admin123@localhost:27017/promocode?authSource=admin'),
        EventEmitterModule.forRoot(),
        CqrsModule,
        PromocodesModule,
    ],
})
export class AppModule { }