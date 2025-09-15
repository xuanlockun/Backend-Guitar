import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './address.entity';
import { User } from '../users/user.entity';

@Injectable()
export class AddressService {
    constructor(
        @InjectRepository(Address)
        private readonly addressRepository: Repository<Address>,
    ) { }

    async createAddress(data: Partial<Address>, userId: string): Promise<Address> {
        const address = this.addressRepository.create({
            ...data,
            user: { id: userId } as User,
        });

        return this.addressRepository.save(address);
    }

    async getUserAddresses(userId: string): Promise<Address[]> {
        return this.addressRepository.find({
            where: { user: { id: userId } },
            relations: ['user'], 
            select: {
                id: true,
                name: true,
                province: true,
                district: true,
                ward: true,
                street: true,
                createdAt: true,
                user: {
                    id: true,
                }
            },
            order: { createdAt: 'DESC' },
        });
    }
}