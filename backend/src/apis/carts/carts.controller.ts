import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Authorize } from 'src/cores/decorators/auth/authorization.decorator';
import { AddProductToCartDto } from './entities/dto/add-product.entity';
import { UpdateCartItemDto } from './entities/dto/update-cartItem.dto';
import { CartServiceV2 } from './cart.service.v2';

@Controller('carts')
export class CartsController {
    constructor(
        private readonly cartServiceV2: CartServiceV2
    ) { }

    @Post()
    @Authorize()
    async createCart(
        @Req() req: any,
        @Body() data: any
    ) {
        const store = '20b76b0c-9c69-49c7-8dd9-ccbe4e50fed1';
        return await this.cartServiceV2.addProductToCart(data, req);
    }

    @Post(':id/updated')
    @Authorize()
    async updateCartItem(
        @Req() req: any,
        @Body() data: UpdateCartItemDto,
        @Param('id') id: string
    ) {
        const user = req.user
        const store = '20b76b0c-9c69-49c7-8dd9-ccbe4e50fed1';
        return await this.cartServiceV2.updateCartItem(id, data, req);
    }

    @Get(':id')
    @Authorize()
    async getCartDetail(
        @Req() req: any,
        @Param('id') id: string
    ) {
        return await this.cartServiceV2.getCartDetail(id, req);
    }
}
