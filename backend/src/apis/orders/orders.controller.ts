import { Body, Controller, Get, NotFoundException, Param, Post, Query, Req, UseInterceptors } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Authorize, AuthorizeGuest } from 'src/cores/decorators/auth/authorization.decorator';
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
    @AuthorizeGuest()
    @FindNearestStoreDecorator()
    async createOrder(
        @Body() data: any,
        @Req() req: any
    ) {
        const { user } = req
        if (user) {
            return await this.ordersService.createOrder(data, user);

        }
        return await this.ordersService.createOrderForGuest(data);
    }

    @Get('/success')
    async handleSuccess(
        @Query('session_id') sessionId: string
    ) {
        return await this.ordersService.handleSuccess(sessionId);
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
