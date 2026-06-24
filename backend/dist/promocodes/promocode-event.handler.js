"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromocodeEventHandler = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const clickhouse_service_1 = require("../database/clickhouse.service");
let PromocodeEventHandler = class PromocodeEventHandler {
    constructor(clickHouseService) {
        this.clickHouseService = clickHouseService;
    }
    async handlePromocodeCreated(payload) {
        await this.clickHouseService.insertPromocode(payload);
    }
    async handlePromocodeUpdated(payload) {
        await this.clickHouseService.updatePromocode(payload.id, payload);
    }
    async handlePromocodeDeleted(payload) {
        await this.clickHouseService.deletePromocode(payload.id);
    }
};
exports.PromocodeEventHandler = PromocodeEventHandler;
__decorate([
    (0, event_emitter_1.OnEvent)('promocode.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PromocodeEventHandler.prototype, "handlePromocodeCreated", null);
__decorate([
    (0, event_emitter_1.OnEvent)('promocode.updated'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PromocodeEventHandler.prototype, "handlePromocodeUpdated", null);
__decorate([
    (0, event_emitter_1.OnEvent)('promocode.deleted'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PromocodeEventHandler.prototype, "handlePromocodeDeleted", null);
exports.PromocodeEventHandler = PromocodeEventHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [clickhouse_service_1.ClickHouseService])
], PromocodeEventHandler);
//# sourceMappingURL=promocode-event.handler.js.map