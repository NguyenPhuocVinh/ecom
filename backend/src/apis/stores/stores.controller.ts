import { Body, Controller, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './entities/dto/create-store.dto';
import { Authorize } from 'src/cores/decorators/auth/authorization.decorator';
import { PagingDto } from 'src/common/dto/page-result.dto';
import { PagingDtoPipe } from 'src/cores/pipes/page-result.dto.pipe';
import { CacheManagerService } from 'src/cores/cache-manager/cache-manager.service';
import { ENTITY_NAME } from 'src/common/constants/enum';
import { AddUserToStoreDto } from './entities/dto/add-user-to-store.dto';
import { GetLocationDecorator } from 'src/cores/decorators/location.decorator';

@Controller('stores')
export class StoresController {
    constructor(
        private readonly storesService: StoresService,
        private readonly cacheManagerService: CacheManagerService
    ) { }

    @Post()
    @Authorize()
    @GetLocationDecorator()
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

    @Get(':id/products')
    // @Authorize()
    async getProductStore(
        @Req() req: any,
        @Param('id') id: string,
        @Query(new PagingDtoPipe()) queryParams: PagingDto
    ) {
        const cacheKey = await this.cacheManagerService.generateCacheKeyForFindAll(
            ENTITY_NAME.STORE,
            'getProductStore',
            queryParams
        )
        const cacheData = await this.cacheManagerService.getCache(cacheKey);
        if (cacheData) {
            return cacheData;
        }
        const data = await this.storesService.getProductStore(id, queryParams, req);
        await this.cacheManagerService.setCache(cacheKey, data);
        return data;
    }

    @Get(':id/users')
    // @Authorize()
    async getUsersStore(
        @Req() req: any,
        @Param('id') id: string,
        @Query(new PagingDtoPipe()) queryParams: PagingDto
    ) {
        const cacheKey = await this.cacheManagerService.generateCacheKeyForFindAll(
            ENTITY_NAME.STORE,
            'getUsersStore',
            queryParams
        )
        const cacheData = await this.cacheManagerService.getCache(cacheKey);
        if (cacheData) {
            return cacheData;
        }
        const data = await this.storesService.getUserStore(id, queryParams, req);
        await this.cacheManagerService.setCache(cacheKey, data);
        return data;
    }

    @Post(':id/add-user')
    @Authorize()
    async addUserToStore(
        @Req() req: any,
        @Body() data: AddUserToStoreDto,
        @Param('id') id: string
    ) {
        const result = await this.storesService.addUserToStore(id, data, req);
        return result;
    }

    @Get()
    // @Authorize()
    async getAllStores(
        @Req() req: any,
        @Param('id') id: string,
        @Query(new PagingDtoPipe()) queryParams: PagingDto
    ) {
        const cacheKey = await this.cacheManagerService.generateCacheKeyForFindAll(
            ENTITY_NAME.STORE,
            'getAllStores',
            queryParams
        )
        const cacheData = await this.cacheManagerService.getCache(cacheKey);
        if (cacheData) {
            return cacheData;
        }
        const data = await this.storesService.getAllStores(queryParams, req);
        await this.cacheManagerService.setCache(cacheKey, data);
        return data;
    }

    @Put(':id')
    @Authorize()
    async updateStore(
        @Req() req: any,
        @Body() data: any,
        @Param('id') id: string
    ) {
        const result = await this.storesService.updateStore(id, data, req);
        return result;
    }
}
