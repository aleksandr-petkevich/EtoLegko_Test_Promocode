import { Controller, Get, Post, Body, Param, Query, NotFoundException } from '@nestjs/common';
import { UsageService } from './usage.service';

@Controller('usage')
export class UsageController {
    constructor(private readonly usageService: UsageService) { }

    @Post()
    create(@Body() createUsageDto: any) {
        return this.usageService.create(createUsageDto);
    }

    @Get()
    findAll(@Query() filters: any) {
        return this.usageService.findAll(filters);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        if (!id || id === 'undefined') {
            throw new NotFoundException('Запись не найдена');
        }
        const usage = await this.usageService.findOne(id);
        if (!usage) {
            throw new NotFoundException('Запись не найдена');
        }
        return usage;
    }
}