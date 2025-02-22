import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './entities/dto/create-store.dto';
import { Authorize } from 'src/cores/decorators/auth/authorization.decorator';

@Controller('stores')
export class StoresController {
    constructor(
        private readonly storesService: StoresService
    ) { }

    @Post()
    @Authorize()
    async create(
        @Body() createStoreDto: CreateStoreDto,
        @Req() req: any
    ) {
        return await this.storesService.create(createStoreDto, req.user);
    }

    @Get(':id')
    // @Authorize()
    async getDetail(
        @Req() req: any,
        @Param('id') id: string
    ) {
        return await this.storesService.getDetail(id);
    }
}
