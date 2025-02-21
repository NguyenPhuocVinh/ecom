import { Injectable, Logger, Query, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './entities/dto/create-category.dto';
import { PagingDtoPipe } from 'src/cores/pipes/page-result.dto.pipe';
import { PagingDto } from 'src/common/dto/page-result.dto';
import { applyConditionOptions } from 'src/common/function-helper/search';
import { paginate } from 'src/common/function-helper/pagination';

@Injectable()
export class CategoriesService {
    private readonly logger = new Logger(CategoriesService.name);
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>,
    ) { }

    async create(createCategoryDto: CreateCategoryDto, createdBy: any) {
        const category = await this.categoryRepository.create({
            ...createCategoryDto,
            cover: { id: createCategoryDto.cover },
            createdBy
        });
        return await this.categoryRepository.save(category);
    }

    async getAll(queryParams: PagingDto, req: any) {
        let qb = this.categoryRepository.createQueryBuilder('category');

        if (queryParams.filterQuery && Array.isArray(queryParams.filterQuery)) {
            qb = applyConditionOptions(qb, queryParams.filterQuery, 'category');
        }

        if (queryParams.fullTextSearch && queryParams.fullTextSearch.searchTerm) {
            qb.andWhere(
                `(category.name ILIKE :fts OR category.longDescription ILIKE :fts OR category.shortDescription ILIKE :fts)`,
                { fts: `%${queryParams.fullTextSearch.searchTerm}%` }
            );
        }

        if (queryParams.sort) {
            Object.entries(queryParams.sort).forEach(([field, order]) => {
                qb.orderBy(`category.${field}`, order);
            });
        }

        return paginate(qb, queryParams.page, queryParams.limit);
    }
}
