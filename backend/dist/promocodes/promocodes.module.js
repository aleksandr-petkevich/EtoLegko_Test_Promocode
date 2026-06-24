"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromocodesModule = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const mongoose_1 = require("@nestjs/mongoose");
const database_module_1 = require("../database/database.module");
const promocode_controller_1 = require("./promocode.controller");
const promocode_service_1 = require("./promocode.service");
const promocode_schema_1 = require("./schemas/promocode.schema");
const promocode_event_handler_1 = require("./promocode-event.handler");
const CommandHandlers = [];
const QueryHandlers = [];
let PromocodesModule = class PromocodesModule {
};
exports.PromocodesModule = PromocodesModule;
exports.PromocodesModule = PromocodesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            cqrs_1.CqrsModule,
            mongoose_1.MongooseModule.forFeature([{ name: 'Promocode', schema: promocode_schema_1.PromocodeSchema }]),
            database_module_1.DatabaseModule,
        ],
        controllers: [promocode_controller_1.PromocodeController],
        providers: [promocode_service_1.PromocodeService, promocode_event_handler_1.PromocodeEventHandler, ...CommandHandlers, ...QueryHandlers],
    })
], PromocodesModule);
//# sourceMappingURL=promocodes.module.js.map