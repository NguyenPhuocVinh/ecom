import { Body, Controller, Post, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Authorize } from 'src/cores/decorators/auth/authorization.decorator';
import { CreateProductDto } from './entities/dto/create-product.dto';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
    ) { }

    @Post()
    @Authorize()
    async createProduct(
        @Req() req: any,
        @Body() createProductDto: any,
    ) {
        return await this.productsService.create(createProductDto, req);
    }
}
