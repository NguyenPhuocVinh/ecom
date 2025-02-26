import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Authorize } from 'src/cores/decorators/auth/authorization.decorator';
import { CreateOrderDto } from './entities/dto/create-order.dto';

@Controller('orders')
export class OrdersController {
    constructor(
        private readonly ordersService: OrdersService,
    ) { }

    @Post()
    @Authorize()
    async createOrder(
        @Body() data: CreateOrderDto,
        @Req() req: any
    ) {
        const { user } = req
        return await this.ordersService.createOrder(data, user);
    }

    @Get(':id')
    async getOrderDetail(
        @Param('id') id: string
    ) {
        return await this.ordersService.getOrderDetail(id);
    }
}
