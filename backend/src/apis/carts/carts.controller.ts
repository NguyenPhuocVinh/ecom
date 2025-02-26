import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { CartsService } from './carts.service';
import { Authorize } from 'src/cores/decorators/auth/authorization.decorator';
import { AddProductToCartDto } from './entities/dto/add-product.entity';
import { UpdateCartItemDto } from './entities/dto/update-cartItem.dto';

@Controller('carts')
export class CartsController {
    constructor(
        private readonly cartsService: CartsService
    ) { }

    @Post()
    @Authorize()
    async createCart(
        @Req() req: any,
        @Body() data: AddProductToCartDto
    ) {
        const user = req.user
        const store = '5265c609-517d-411f-b2e6-d9e8a53d146a';
        return await this.cartsService.addProductToCart(data, store, user);
    }

    @Post(':id/updated')
    @Authorize()
    async updateCartItem(
        @Req() req: any,
        @Body() data: UpdateCartItemDto,
        @Param('id') id: string
    ) {
        const user = req.user
        const store = '5265c609-517d-411f-b2e6-d9e8a53d146a';
        return await this.cartsService.updateCartItem(id, data, store, user);
    }

    @Get(':id')
    @Authorize()
    async getCartDetail(
        @Req() req: any
    ) {
        const user = req.user
        return await this.cartsService.getCartDetail(user);
    }
}
