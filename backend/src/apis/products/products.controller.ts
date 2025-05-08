import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
// import { ProductsService } from './products.service';
import { Authorize } from 'src/cores/decorators/auth/authorization.decorator';
import { CreateProductDto } from './entities/dto/create-product.dto';
import { PagingDto } from 'src/common/dto/page-result.dto';
import { PagingDtoPipe } from 'src/cores/pipes/page-result.dto.pipe';
import { ProductServiceV2 } from './product.service.v2';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductServiceV2,
    ) { }

    @Post()
    // @Authorize()
    async createProduct(
        @Req() req: any,
        @Body() createProductDto: any,
    ) {
        return await this.productsService.createProduct(createProductDto);
    }

    @Get()
    async getAll(
        @Req() req: any,
        @Query(new PagingDtoPipe()) queryParams: PagingDto,
    ) {
        // return await this.productsService.getAll(queryParams, req);
    }

    @Get(':id')
    async getProductDetail(
        @Req() req: any,
        @Param('id') id: string,
    ) {
        return await this.productsService.getProductById(id);
    }

    // @Put(':id')
    // // @Authorize()
    // async updateProduct(
    //     @Req() req: any,
    //     @Param('id') id: string,
    //     @Body() data: any,
    // ) {
    //     return await this.productsService.updateProduct(id, data);
    // }

    @Delete(':id')
    @Authorize()
    async deleteProduct(
        @Req() req: any,
        @Param('id') id: string,
    ) {
        // return await this.productsService.delete(id, req);
    }

}
