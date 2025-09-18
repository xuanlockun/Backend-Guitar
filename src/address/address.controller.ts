import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AddressService } from './address.service';
import { Address } from './address.entity';

@Controller('address')
export class AddressController {
    constructor(private readonly addressService: AddressService) { }
    @UseGuards(AuthGuard)
    @Get()
    async getMyAddress(@Request() req) {
        const userid = req.user.sub;
        console.log('UserId:', userid);

        return this.addressService.getUserAddresses(userid);
    }

    @UseGuards(AuthGuard)
    @Post()
    create(@Request() req, @Body() body: Partial<Address>) {
        console.log('JWT payload:', req.user);
        const userId = req.user?.sub;
        console.log('UserId:', userId);
        return this.addressService.createAddress(body, userId);
    }
}
