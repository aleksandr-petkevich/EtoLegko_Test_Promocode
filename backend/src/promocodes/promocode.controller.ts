import { Controller, Get, Post, Put, Delete, Body, Param, Query, NotFoundException } from '@nestjs/common';
import { PromocodeService } from './promocode.service';

@Controller('promocodes')
export class PromocodeController {
    constructor(private readonly promocodeService: PromocodeService) { }

    @Get()
    findAll(@Query() filters: any) {
        return this.promocodeService.findAll(filters);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        if (!id || id === 'undefined') {
            throw new NotFoundException('Промокод не найден');
        }
        const promocode = await this.promocodeService.findOne(id);
        if (!promocode) {
            throw new NotFoundException('Промокод не найден');
        }
        return promocode;
    }

    @Post()
    create(@Body() createPromocodeDto: any) {
        return this.promocodeService.create(createPromocodeDto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updatePromocodeDto: any) {
        return this.promocodeService.update(id, updatePromocodeDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        const result = await this.promocodeService.remove(id);
        if (!result) {
            throw new NotFoundException('Промокод не найден');
        }
        return { message: 'Промокод успешно удалён' };
    }

    @Get('analytics/dashboard')
    getAnalytics() {
        return this.promocodeService.getAnalytics();
    }
}