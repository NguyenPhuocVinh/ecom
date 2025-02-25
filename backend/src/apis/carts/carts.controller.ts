import { Body, Controller, Param, Post, Req } from '@nestjs/common';
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
        return await this.cartsService.addProductToCart(data, user);
    }

    @Post('id/update')
    @Authorize()
    async updateCartItem(
        @Req() req: any,
        @Body() data: UpdateCartItemDto,
        @Param('id') id: string
    ) {
        const user = req.user
        return await this.cartsService.updateCartItem(id, data, user);
    }
}
