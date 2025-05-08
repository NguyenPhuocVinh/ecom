import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiBody, ApiQuery } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './entities/dto/create-category.dto';
import { Authorize } from 'src/cores/decorators/auth/authorization.decorator';
import { PagingDto } from 'src/common/dto/page-result.dto';
import { PagingDtoPipe } from 'src/cores/pipes/page-result.dto.pipe';
import { CacheManagerService } from 'src/cores/cache-manager/cache-manager.service';
import { ENTITY_NAME } from 'src/common/constants/enum';
import { UpdateCategoryDto } from './entities/dto/update-category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
    constructor(
        private readonly categoriesService: CategoriesService,
        private readonly cacheManagerService: CacheManagerService
    ) { }

    @Post()
    @Authorize()
    @ApiBearerAuth()
    @ApiBody({ type: CreateCategoryDto })
    async create(
        @Body() createCategoryDto: CreateCategoryDto,
        @Req() req: any
    ) {
        return await this.categoriesService.create(createCategoryDto, req.user);
    }

    @Get()
    async getAll(
        @Req() req: any,
        @Query(new PagingDtoPipe()) queryParams: PagingDto
    ) {
        const user = req.user;
        const cacheKey = await this.cacheManagerService.generateCacheKeyForFindAll(
            ENTITY_NAME.CATEGORY,
            'getAll',
            { ...queryParams, ...user },

        );
        const cacheData = await this.cacheManagerService.getCache(cacheKey);
        // if (cacheData) {
        //     return cacheData;
        // }
        const result = await this.categoriesService.getAll(queryParams, req);
        await this.cacheManagerService.setCache(cacheKey, result);
        return result;
    }

    @Get(':id')
    async getById(
        @Req() req: any,
        @Param('id') id: string
    ) {
        const user = req.user;
        const cacheKey = await this.cacheManagerService.generateCacheKeyForFindOne(
            ENTITY_NAME.CATEGORY,
            'getById',
            id,
            user,
        );
        const cacheData = await this.cacheManagerService.getCache(cacheKey);
        // if (cacheData) {
        //     return cacheData;
        // }
        const result = await this.categoriesService.getById(id);
        await this.cacheManagerService.setCache(cacheKey, result);
        return result;
    }

    @Put(':id')
    @Authorize()
    async update(
        @Req() req: any,
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto
    ) {
        return await this.categoriesService.update(id, updateCategoryDto, req.user);
    }

    @Delete(':id')
    @Authorize()
    async delete(
        @Req() req: any,
        @Param('id') id: string
    ) {
        return await this.categoriesService.delete(id, req.user);
    }
}
