import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { Authorize } from 'src/cores/decorators/auth/authorization.decorator';
import { CreateDiscountDto } from './entities/dto/create-discout.dto';
import { PagingDtoPipe } from 'src/cores/pipes/page-result.dto.pipe';
import { PagingDto } from 'src/common/dto/page-result.dto';
import { UpdateDiscountDto } from './entities/dto/update-discount.dto';

@Controller('discounts')
export class DiscountsController {
    constructor(
        private readonly discountsService: DiscountsService
    ) { }

    @Post()
    @Authorize()
    async create(
        @Body() data: CreateDiscountDto,
        @Req() req: any
    ) {
        return await this.discountsService.create(data, req);
    }

    @Get()
    @Authorize()
    async getAllDiscounts(
        @Query(new PagingDtoPipe()) queryParams: PagingDto,
        @Req() req: any
    ) {
        return await this.discountsService.getAllDiscounts(queryParams, req);
    }

    @Get(':id')
    @Authorize()
    async getDiscountDetail(
        @Param('id') id: string,
        @Req() req: any
    ) {
        return await this.discountsService.getDiscountDetail(id, req);
    }

    @Put(':id')
    @Authorize()
    async update(
        @Body() data: UpdateDiscountDto,
        @Req() req: any,
        @Param('id') id: string
    ) {
        return await this.discountsService.update(id, data, req);
    }

    @Delete(':id')
    @Authorize()
    async delete(
        @Param('id') id: string,
        @Req() req: any
    ) {
        return await this.discountsService.delete(id, req);
    }
}
