import { Body, Controller, Get, Param, Post, Req, UseInterceptors } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Authorize } from 'src/cores/decorators/auth/authorization.decorator';
import { CreateOrderDto } from './entities/dto/create-order.dto';
import { CacheManagerService } from 'src/cores/cache-manager/cache-manager.service';
import { ENTITY_NAME } from 'src/common/constants/enum';
import { FindNearestStoreDecorator } from 'src/cores/decorators/location.decorator';
import { FindNearestStoreInterceptor } from 'src/cores/interceptors/find-nearest-store.interceptor';

@Controller('orders')
export class OrdersController {
    constructor(
        private readonly ordersService: OrdersService,
        private readonly cacheManagerService: CacheManagerService
    ) { }

    @Post()
    @Authorize()
    @FindNearestStoreDecorator()
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
        const cacheKey = await this.cacheManagerService.generateCacheKeyForFindOne(
            ENTITY_NAME.ORDER,
            'getDetail',
            id
        )
        const cacheData = await this.cacheManagerService.getCache(cacheKey);
        if (cacheData) return cacheData;
        const result = await this.ordersService.getOrderDetail(id);
        await this.cacheManagerService.setCache(cacheKey, result);
        return result;
    }
}
