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
exports.UsageSchema = exports.Usage = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Usage = class Usage {
};
exports.Usage = Usage;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Usage.prototype, "promocode_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Usage.prototype, "promocode_code", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Usage.prototype, "used_at", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0, default: 1 }),
    __metadata("design:type", Number)
], Usage.prototype, "usage_count", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Usage.prototype, "user_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Usage.prototype, "comment", void 0);
exports.Usage = Usage = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Usage);
exports.UsageSchema = mongoose_1.SchemaFactory.createForClass(Usage);
//# sourceMappingURL=usage.schema.js.map