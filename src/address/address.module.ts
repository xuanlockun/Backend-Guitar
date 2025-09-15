import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './address.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Address,User])
  ],
  controllers: [AddressController],
  providers: [AddressService]
})
export class AddressModule {}
