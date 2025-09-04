import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cat } from './cat.entity';

@Injectable()
export class CatsService {
    constructor(
        @InjectRepository(Cat)
        private catsRepository: Repository<Cat>,
    ) { }

    findAll(): Promise<Cat[]> {
        return this.catsRepository.find();
    }

    findOne(id: number): Promise<Cat | null> {  // <-- sửa: có thể null
        return this.catsRepository.findOneBy({ id });
    }

    create(cat: Partial<Cat>): Promise<Cat> {
        const newCat = this.catsRepository.create(cat);
        return this.catsRepository.save(newCat);
    }

    async update(id: number, cat: Partial<Cat>): Promise<Cat | null> {
        await this.catsRepository.update(id, cat);
        return this.catsRepository.findOneBy({ id });
    }

    async remove(id: number): Promise<void> {
        await this.catsRepository.delete(id);
    }
}
