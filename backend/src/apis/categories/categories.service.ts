import { BadGatewayException, BadRequestException, Injectable, Logger, NotFoundException, Query, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './entities/dto/create-category.dto';
import { PagingDtoPipe } from 'src/cores/pipes/page-result.dto.pipe';
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

        private readonly mediasService: MediasService
    ) { }

    async create(createCategoryDto: CreateCategoryDto, createdBy: any) {
        const { name, cover, parentId } = createCategoryDto;

        const slug = slugify(name, { lower: true });
        const existingCategory = await this.categoryRepository.findOne({ where: { slug } });
        if (existingCategory) throw new BadRequestException("CATEGORY_ALREADY_EXISTS");

        let parent = null;
        if (parentId) {
            parent = await this.categoryRepository.findOne({ where: { id: parentId } });
            if (!parent) throw new BadRequestException("PARENT_CATEGORY_NOT_FOUND");
        }

        let fileEntity = null;
        if (cover) {
            fileEntity = await this.mediasService.getMediaById(cover);
            if (!fileEntity) {
                throw new BadRequestException("COVER_IMAGE_NOT_FOUND");
            }
        }

        const newCategory = this.categoryRepository.create({
            ...createCategoryDto,
            cover: fileEntity,
            parent,
            createdBy
        });

        return await this.categoryRepository.save(newCategory);
    }

    async getAll(queryParams: PagingDto, req: any) {
        const { filterQuery, fullTextSearch, sort, page, limit } = queryParams;

        let qb = this.categoryRepository.createQueryBuilder('category')
            .leftJoin('category.cover', 'cover')
            .leftJoin('category.createdBy', 'createdBy')
            .leftJoin('category.updatedBy', 'updatedBy')
            .select('category')
            .addSelect([
                'createdBy.id',
                'createdBy.firstName',
                'createdBy.lastName',
                'createdBy.email',
                'createdBy.fullName',
                'cover.id',
                'cover.url',
                'cover.alt',
                'cover.title',
                'cover.secure_url',
                'updatedBy.id',
                'updatedBy.firstName',
                'updatedBy.lastName',
                'updatedBy.email'

            ]);

        if (filterQuery && Array.isArray(filterQuery)) {
            const hasStatus = filterQuery.some(condition => {
                return condition.key && condition.key.toLowerCase() === 'status';
            });
            if (!hasStatus) {
                filterQuery.push({ key: 'status', operator: OPERATOR.EQ, value: STATUS.ACTIVED });
            }
            qb = applyConditionOptions(qb, filterQuery, 'category');
        } else {
            qb = qb.andWhere('category.status = :status', { status: STATUS.ACTIVED });
        }

        if (fullTextSearch && fullTextSearch.searchTerm) {
            qb.andWhere(
                `(category.name ILIKE :fts OR category.longDescription ILIKE :fts OR category.shortDescription ILIKE :fts)`,
                { fts: `%${fullTextSearch.searchTerm}%` }
            );
        }

        if (sort) {
            Object.entries(sort).forEach(([key, order]) => {
                qb.orderBy(`category.${key}`, order as ("ASC" | "DESC"));
            });
        }

        const paginatedRootCategories = await paginate(qb, page, limit);
        const roots = paginatedRootCategories.data;

        const treeRepository = this.categoryRepository.manager.getTreeRepository(CategoryEntity);
        const trees = await Promise.all(roots.map(async (root: CategoryEntity) => {
            return await treeRepository.findAncestorsTree(root);
        }));

        paginatedRootCategories.data = trees;
        return paginatedRootCategories;
    }

    async getById(id: string) {
        const categoryEntity = await this.categoryRepository
            .createQueryBuilder('category')
            .leftJoin('category.cover', 'cover')
            .leftJoin('category.createdBy', 'createdBy')
            .leftJoin('category.updatedBy', 'updatedBy')
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
                'updatedBy.email'
            ])
            .leftJoinAndSelect('category.children', 'children')
            .where('category.id = :id', { id })
            .getOne();

        if (!categoryEntity) {
            throw new NotFoundException(`CATEGORY_NOT_FOUND`);
        }

        const treeRepository = this.categoryRepository.manager.getTreeRepository(CategoryEntity);
        const fullTree = await treeRepository.findDescendantsTree(categoryEntity);
        return fullTree;
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto, updatedBy: any) {
        const {
            name,
            cover,
            longDescription,
            shortDescription,
            parentId,
            status,
        } = updateCategoryDto;

        const slug = slugify(name, { lower: true });
        const existingCategory = await this.categoryRepository.findOne({ where: { slug } });
        if (existingCategory) throw new BadRequestException("CATEGORY_ALREADY_EXISTS");

        const categoryEntity = await this.categoryRepository.findOneById(id);
        if (!categoryEntity) throw new NotFoundException(`CATEGORY_NOT_FOUND`);
        const fileEntity = await this.mediasService.getMediaById(cover);
        if (!fileEntity)
            throw new BadRequestException("COVER_IMAGE_NOT_FOUND");

        let parent = null;
        if (parentId) {
            parent = await this.categoryRepository.findOne({ where: { id: parentId } });
            if (!parent) throw new BadRequestException("PARENT_CATEGORY_NOT_FOUND");
        }
        await this.categoryRepository.update(id, {
            ...updateCategoryDto,
            cover: fileEntity,
            parent,
            slug,
            updatedBy
        });
        return await this.getById(id);
    }

    async delete(id: string, req: any) {
        const categoryEntity = await this.categoryRepository.findOneById(id);
        if (!categoryEntity) throw new NotFoundException(`CATEGORY_NOT_FOUND`);
        const treeRepository = this.categoryRepository.manager.getTreeRepository(CategoryEntity);
        const fullTree = await treeRepository.findDescendantsTree(categoryEntity);
        if (fullTree.children.length > 0) {
            await this.categoryRepository.remove(fullTree.children);
        }
        return await this.categoryRepository.remove(fullTree);
    }
}

