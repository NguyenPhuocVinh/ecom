import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './entities/dto/create-category.dto';
import { PagingDto } from 'src/common/dto/page-result.dto';
import { applyConditionOptions } from 'src/common/function-helper/search';
import { paginate } from 'src/common/function-helper/pagination';
import { OPERATOR, STATUS } from 'src/common/constants/enum';
import { MediasService } from '../medias/medias.service';
import slugify from 'slugify';
import { UpdateCategoryDto } from './entities/dto/update-category.dto';

@Injectable()
export class CategoriesService {
    private readonly logger = new Logger(CategoriesService.name);
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>,
        private readonly mediasService: MediasService,
    ) { }

    async create(createCategoryDto: CreateCategoryDto, createdBy: any) {
        const { name, cover, parentId, ...rest } = createCategoryDto;
        const slug = slugify(name, { lower: true });
        const existingCategory = await this.categoryRepository.findOne({ where: { slug } });
        if (existingCategory) throw new BadRequestException('CATEGORY_ALREADY_EXISTS');

        let parent = null;
        if (parentId) {
            parent = await this.categoryRepository.findOne({ where: { id: parentId } });
            if (!parent) throw new BadRequestException('PARENT_CATEGORY_NOT_FOUND');
        }

        const newCategory: CategoryEntity = this.categoryRepository.create({
            ...rest,
            name,
            cover: cover ? { id: cover } : null,
            parent,
            createdBy,
            slug,
        });

        const data = await this.categoryRepository.save(newCategory);
        return { data };
    }

    async getAll(queryParams: PagingDto, req: any) {
        const { filterQuery, fullTextSearch, sort, page, limit } = queryParams;

        let qb = this.categoryRepository
            .createQueryBuilder('category')
            .leftJoin('category.cover', 'cover')
            .leftJoin('category.createdBy', 'createdBy')
            .leftJoin('category.updatedBy', 'updatedBy')
            .leftJoinAndSelect('category.parent', 'parent')
            .leftJoinAndSelect('category.children', 'children')
            .select('category')
            .addSelect([
                'cover.id',
                'cover.url',
                'cover.alt',
                'cover.title',
                'cover.secure_url',
                'createdBy.id',
                'createdBy.firstName',
                'createdBy.lastName',
                'createdBy.email',
                'createdBy.fullName',
                'updatedBy.id',
                'updatedBy.firstName',
                'updatedBy.lastName',
                'updatedBy.email',
                'parent.id',
                'parent.name',
                'parent.slug',
                'parent.shortDescription',
                'parent.longDescription',
                'children.id',
                'children.name',
                'children.slug',
                'children.shortDescription',
                'children.longDescription',
            ]);

        if (filterQuery && Array.isArray(filterQuery)) {
            const hasStatus = filterQuery.some((condition) => condition.key.toLowerCase() === 'status');
            if (!hasStatus) {
                filterQuery.push({ key: 'status', operator: OPERATOR.EQ, value: STATUS.ACTIVED });
            }
            qb = applyConditionOptions(qb, { and: filterQuery, or: [] }, 'category');
        } else {
            qb = qb.andWhere('category.status = :status', { status: STATUS.ACTIVED });
        }

        if (fullTextSearch && fullTextSearch.searchTerm) {
            qb.andWhere(
                `(category.name ILIKE :fts OR category.longDescription ILIKE :fts OR category.shortDescription ILIKE :fts)`,
                { fts: `%${fullTextSearch.searchTerm}%` },
            );
        }

        if (sort) {
            Object.entries(sort).forEach(([key, order]) => {
                qb.orderBy(`category.${key}`, order as 'ASC' | 'DESC');
            });
        }

        const paginatedCategories = await paginate(qb, page, limit);
        return paginatedCategories;
    }

    async getById(id: string) {
        const categoryEntity = await this.categoryRepository
            .createQueryBuilder('category')
            .leftJoin('category.cover', 'cover')
            .leftJoin('category.createdBy', 'createdBy')
            .leftJoin('category.updatedBy', 'updatedBy')
            .leftJoin('category.parent', 'parent')
            .leftJoin('category.children', 'children')
            .addSelect([
                'cover.id',
                'cover.url',
                'cover.alt',
                'cover.title',
                'cover.secure_url',
                'createdBy.id',
                'createdBy.firstName',
                'createdBy.lastName',
                'createdBy.email',
                'updatedBy.id',
                'updatedBy.firstName',
                'updatedBy.lastName',
                'updatedBy.email',
                'parent.id',
                'parent.name',
                'children.id',
                'children.name',
            ])
            .where('category.id = :id', { id })
            .getOne();

        if (!categoryEntity) {
            throw new NotFoundException(`CATEGORY_NOT_FOUND`);
        }

        return { data: categoryEntity };
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto, updatedBy: any) {
        const { name, cover, longDescription, shortDescription, parentId, status } = updateCategoryDto;
        const slug = slugify(name, { lower: true });
        const existingCategory = await this.categoryRepository.findOne({ where: { slug } });
        if (existingCategory && existingCategory.id !== id) throw new BadRequestException('CATEGORY_ALREADY_EXISTS');

        const categoryEntity = await this.categoryRepository.findOneBy({ id });
        if (!categoryEntity) throw new NotFoundException(`CATEGORY_NOT_FOUND`);

        let fileEntity = null;
        if (cover) {
            fileEntity = await this.mediasService.getMediaById(cover);
            if (!fileEntity) throw new BadRequestException('COVER_IMAGE_NOT_FOUND');
        }

        let parent = null;
        if (parentId) {
            parent = await this.categoryRepository.findOne({ where: { id: parentId } });
            if (!parent) throw new BadRequestException('PARENT_CATEGORY_NOT_FOUND');
        }

        await this.categoryRepository.update(id, {
            name,
            longDescription,
            shortDescription,
            cover: fileEntity,
            parent,
            status,
            slug,
            updatedBy,
        });

        return await this.getById(id);
    }

    async delete(id: string, user: any) {
        const categoryEntity = await this.categoryRepository.findOne({ where: { id }, relations: ['children'] });
        if (!categoryEntity) throw new NotFoundException(`CATEGORY_NOT_FOUND`);

        if (categoryEntity.children && categoryEntity.children.length > 0) {
            await this.categoryRepository.remove(categoryEntity.children);
        }

        return await this.categoryRepository.remove(categoryEntity);
    }

}