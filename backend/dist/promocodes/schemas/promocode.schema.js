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
exports.PromocodeSchema = exports.Promocode = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Promocode = class Promocode {
};
exports.Promocode = Promocode;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Promocode.prototype, "code", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['percentage', 'fixed'] }),
    __metadata("design:type", String)
], Promocode.prototype, "discount_type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Promocode.prototype, "discount_value", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Promocode.prototype, "valid_until", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0, default: 1 }),
    __metadata("design:type", Number)
], Promocode.prototype, "usage_limit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0, default: 0 }),
    __metadata("design:type", Number)
], Promocode.prototype, "usage_count", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['active', 'expired', 'disabled'], default: 'active' }),
    __metadata("design:type", String)
], Promocode.prototype, "status", void 0);
exports.Promocode = Promocode = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Promocode);
exports.PromocodeSchema = mongoose_1.SchemaFactory.createForClass(Promocode);
//# sourceMappingURL=promocode.schema.js.map