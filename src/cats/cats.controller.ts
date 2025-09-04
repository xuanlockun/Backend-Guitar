import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { CatsService } from './cats.service';
import { Cat } from './cat.entity';
import { AuthGuard } from '../auth/auth.guard';

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

    @UseGuards(AuthGuard)
    @Post()
    async create(@Body() catData: Partial<Cat>): Promise<Cat> {
        return this.catsService.create(catData);
    }

    @UseGuards(AuthGuard)
    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateData: Partial<Cat>,
    ): Promise<Cat | null> {
        return this.catsService.update(+id, updateData);
    }
    
    @UseGuards(AuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<{ deleted: boolean }> {
        await this.catsService.remove(+id);
        return { deleted: true };
    }
}
