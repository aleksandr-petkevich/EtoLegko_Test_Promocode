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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromocodeController = void 0;
const common_1 = require("@nestjs/common");
const promocode_service_1 = require("./promocode.service");
let PromocodeController = class PromocodeController {
    constructor(promocodeService) {
        this.promocodeService = promocodeService;
    }
    findAll(filters) {
        return this.promocodeService.findAll(filters);
    }
    async findOne(id) {
        if (!id || id === 'undefined') {
            throw new common_1.NotFoundException('Промокод не найден');
        }
        const promocode = await this.promocodeService.findOne(id);
        if (!promocode) {
            throw new common_1.NotFoundException('Промокод не найден');
        }
        return promocode;
    }
    create(createPromocodeDto) {
        return this.promocodeService.create(createPromocodeDto);
    }
    update(id, updatePromocodeDto) {
        return this.promocodeService.update(id, updatePromocodeDto);
    }
    async remove(id) {
        const result = await this.promocodeService.remove(id);
        if (!result) {
            throw new common_1.NotFoundException('Промокод не найден');
        }
        return { message: 'Промокод успешно удалён' };
    }
    getAnalytics() {
        return this.promocodeService.getAnalytics();
    }
};
exports.PromocodeController = PromocodeController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PromocodeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PromocodeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PromocodeController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PromocodeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PromocodeController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('analytics/dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PromocodeController.prototype, "getAnalytics", null);
exports.PromocodeController = PromocodeController = __decorate([
    (0, common_1.Controller)('promocodes'),
    __metadata("design:paramtypes", [promocode_service_1.PromocodeService])
], PromocodeController);
//# sourceMappingURL=promocode.controller.js.map