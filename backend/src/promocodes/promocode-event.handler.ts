import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClickHouseService } from '../database/clickhouse.service';

@Injectable()
export class PromocodeEventHandler {
    constructor(private clickHouseService: ClickHouseService) { }

    @OnEvent('promocode.created')
    async handlePromocodeCreated(payload: any) {
        await this.clickHouseService.insertPromocode(payload);
    }

    @OnEvent('promocode.updated')
    async handlePromocodeUpdated(payload: any) {
        await this.clickHouseService.updatePromocode(payload.id, payload);
    }

    @OnEvent('promocode.deleted')
    async handlePromocodeDeleted(payload: { id: string }) {
        await this.clickHouseService.deletePromocode(payload.id);
    }
}