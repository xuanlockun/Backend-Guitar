import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { CatsService } from './cats.service';
import { Cat } from './cat.entity';

@Controller('cats')
export class CatsController {
    constructor(private readonly catsService: CatsService) { }

    @Get()
    async findAll(): Promise<Cat[]> {
        return this.catsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Cat | null> {
        return this.catsService.findOne(+id);
    }

    @Post()
    async create(@Body() catData: Partial<Cat>): Promise<Cat> {
        return this.catsService.create(catData);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateData: Partial<Cat>,
    ): Promise<Cat | null> {
        return this.catsService.update(+id, updateData);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<{ deleted: boolean }> {
        await this.catsService.remove(+id);
        return { deleted: true };
    }
}
