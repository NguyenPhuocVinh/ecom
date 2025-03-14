import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager, In } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { CategoryEntity } from '../categories/entities/category.entity';
import { CreateProductDto } from './entities/dto/create-product.dto';
import { typeormTransactionHandler } from 'src/common/function-helper/transaction';
import slugify from 'slugify';
import { PriceEntity } from './entities/price.entity';
import { error } from 'console';
import { InventoryEntity } from '../inventories/entities/inventory.entity';
import { StoreEntity } from '../stores/entities/store.entity';
import { AttributeEntity } from './entities/atribute.entity';
import { VariantEntity } from './entities/variant.entity';
import { FileEntity } from '../medias/entities/media.entity';
import { PagingDto } from 'src/common/dto/page-result.dto';
import { OPERATOR, PRODUCT_STATUS } from 'src/common/constants/enum';
import { applyConditionOptions } from 'src/common/function-helper/search';
import { paginate } from 'src/common/function-helper/pagination';

@Injectable()
export class ProductsService {
    private readonly logger = new Logger(ProductsService.name);

    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,

        @InjectRepository(InventoryEntity)
        private readonly inventoryRepository: Repository<InventoryEntity>,

        @InjectRepository(PriceEntity)
        private readonly priceRepository: Repository<PriceEntity>,

        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>,

        @InjectRepository(StoreEntity)
        private readonly storeRepository: Repository<StoreEntity>,

        @InjectRepository(AttributeEntity)
        private readonly atributeRepository: Repository<AttributeEntity>,

        @InjectRepository(VariantEntity)
        private readonly variantRepository: Repository<VariantEntity>,

        @InjectDataSource() private readonly dataSource: DataSource,
    ) { }

    async create(createProductDto: CreateProductDto, req: any) {
        const {
            name,
            categoryId,
            longDescription,
            shortDescription,
            featuredImages,
            stores,
            attributes,
        } = createProductDto;

        const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
        if (!category) throw new NotFoundException('CATEGORY_NOT_FOUND');

        const storeEntities = await this.storeRepository.find({
            where: { id: In(stores) },
        });


        if (storeEntities.length !== stores.length) throw new NotFoundException('SOME_STORES_NOT_FOUND');

        let createdProduct: ProductEntity;

        await typeormTransactionHandler(
            async (manager: EntityManager) => {
                const product = this.productRepository.create({
                    name,
                    longDescription,
                    shortDescription,
                    category,
                    featuredImages: featuredImages ? featuredImages.map((id) => ({ id })) : null,
                });
                createdProduct = await manager.save(ProductEntity, product);

                if (attributes && attributes.length > 0) {
                    const attributeEntities = await Promise.all(
                        attributes.map(async (attrDto) => {
                            const attrEntity = this.atributeRepository.create({
                                code: attrDto.code,
                                key: attrDto.key.toLowerCase(),
                                value: attrDto.value,
                                product: createdProduct,
                                featuredImages: attrDto.featuredImages ? attrDto.featuredImages.map((id) => ({ id })) : [],
                            });
                            return manager.save(AttributeEntity, attrEntity);
                        })
                    );

                    await Promise.all(
                        attributes.map(async (attrDto, index) => {
                            const attrEntity = attributeEntities[index];
                            if (attrDto.variants && attrDto.variants.length > 0) {
                                const variantEntities = await Promise.all(
                                    attrDto.variants.map(async (variantDto) => {
                                        const priceEntity = this.priceRepository.create({
                                            rootPrice: variantDto.price,
                                        });
                                        const createdPriceEntity = await manager.save(PriceEntity, priceEntity);

                                        const variantEntity = this.variantRepository.create({
                                            code: variantDto.code,
                                            key: variantDto.key.toLowerCase(),
                                            value: variantDto.value,
                                            price: createdPriceEntity,
                                            attribute: attrEntity,
                                            featuredImages: variantDto.featuredImages ? variantDto.featuredImages?.map((id) => ({ id })) : [],
                                        });
                                        return manager.save(VariantEntity, variantEntity);
                                    })
                                );

                                await Promise.all(
                                    variantEntities.flatMap((variantEntity) =>
                                        storeEntities.map(async (store) => {
                                            const inventoryEntity = manager.create(InventoryEntity, {
                                                variant: variantEntity,
                                                store: store,
                                                quantity: Number(attrDto.variants.find(v => v.code === variantEntity.code)?.quantity) || 0,
                                            });
                                            return manager.save(InventoryEntity, inventoryEntity);
                                        })
                                    )
                                );
                            }
                        })
                    );
                }
            },
            (error) => {
                this.logger.error('Error during product creation', error.stack);
                throw new BadRequestException(error);
            },
            this.dataSource
        );

        return await this.getDetail(createdProduct.id);
    }

    async getDetail(id: string) {
        const product = await this.productRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.price', 'price')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoin('product.featuredImages', 'featuredImages')
            .addSelect(['featuredImages.id', 'featuredImages.secure_url', 'featuredImages.url', 'featuredImages.title', 'featuredImages.alt'])
            .leftJoinAndSelect('product.attributes', 'attributes')
            .leftJoin('attributes.featuredImages', 'attributeImages')
            .addSelect(['attributeImages.id', 'attributeImages.secure_url', 'attributeImages.url', 'attributeImages.title', 'attributeImages.alt'])
            .leftJoinAndSelect('attributes.variants', 'variants')
            .leftJoinAndSelect('variants.price', 'variantPrice')
            .leftJoinAndSelect('variants.inventories', 'inventories')
            .leftJoin('variants.featuredImages', 'variantImages')
            .addSelect(['variantImages.id', 'variantImages.secure_url', 'variantImages.url', 'variantImages.title', 'variantImages.alt'])
            .leftJoin('inventories.store', 'store')
            .addSelect(['store.id', 'store.name', 'store.address', 'store.phone'])
            .where('product.id = :id', { id })
            .getOne();
        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }

        await this.productRepository.update(id, { viewCount: product.viewCount + 1 });
        return { data: product };
    }

    async updateQuantity(id: string, data: any, req: any) {
        const { storeId, quantity, atribute, variant } = data;
        const product = await this.productRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.attributes', 'attributes')
            .leftJoinAndSelect('attributes.variants', 'variants')
            .leftJoinAndSelect('variants.inventory', 'inventory')
            .leftJoinAndSelect('inventory.store', 'store')
            .where('product.id = :id', { id })
            .andWhere('store.id = :storeId', { storeId })
            .andWhere('attributes.code = :attribute', { attribute: atribute })
            .andWhere('variants.code = :variant', { variant })
            .getOne();
        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }
        // const inventory = product.attributes[0].variants[0].inventory;
        // if (!inventory) {
        //     throw new NotFoundException(`Inventory not found`);
        // }
        // await this.inventoryRepository.update(inventory.id, { quantity: inventory.quantity + quantity });
        return await this.getDetail(id);
    }

    async getAll(queryParams: PagingDto, req: any) {
        const { page, limit, fullTextSearch, sort, filterQuery, searchType } = queryParams;

        let qb = this.productRepository.createQueryBuilder('product')
            .leftJoin('product.featuredImages', 'featuredImages')
            .addSelect([
                'featuredImages.id',
                'featuredImages.secure_url',
                'featuredImages.url',
                'featuredImages.title',
                'featuredImages.alt'
            ])
            .leftJoinAndSelect('product.attributes', 'attributes')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('category.parent', 'parentCategory')
            .leftJoinAndSelect('attributes.variants', 'variants')
            .leftJoin('attributes.featuredImages', 'attributeImages')
            .addSelect([
                'attributeImages.id',
                'attributeImages.secure_url',
                'attributeImages.url',
                'attributeImages.title',
                'attributeImages.alt'
            ])
            .leftJoinAndSelect('variants.price', 'price')
            .leftJoinAndSelect('variants.inventories', 'inventories')
            .leftJoinAndSelect('inventories.store', 'inventoryStore')
            .leftJoin('variants.featuredImages', 'variantImages')
            .addSelect([
                'variantImages.id',
                'variantImages.secure_url',
                'variantImages.url',
                'variantImages.title',
                'variantImages.alt'
            ]);

        if (filterQuery && Array.isArray(filterQuery)) {
            const categoryFilterIndex = filterQuery.findIndex(
                condition => condition.alias === 'category'
            );
            if (categoryFilterIndex > -1) {
                const [categoryFilter] = filterQuery.splice(categoryFilterIndex, 1);
                qb = qb.andWhere(
                    'category.id = :categoryId OR parentCategory.id = :categoryId',
                    { categoryId: categoryFilter.value }
                );
            }

            // Đảm bảo áp dụng điều kiện status nếu chưa có
            const hasStatus = filterQuery.some(
                condition => condition.key?.toLowerCase() === 'status'
            );
            if (!hasStatus) {
                filterQuery.push({
                    key: 'status',
                    operator: OPERATOR.EQ,
                    value: PRODUCT_STATUS.ACTIVED
                });
            }

            // Áp dụng các điều kiện còn lại từ filterQuery
            qb = applyConditionOptions(qb, { and: filterQuery, or: [] }, 'product');
        } else {
            qb = qb.andWhere('product.status = :status', {
                status: PRODUCT_STATUS.ACTIVED
            });
        }

        // Full text search
        if (fullTextSearch?.searchTerm) {
            qb.andWhere(
                `(product.name ILIKE :fts OR product.longDescription ILIKE :fts OR product.shortDescription ILIKE :fts)`,
                { fts: `%${fullTextSearch.searchTerm}%` }
            );
        }

        // Sắp xếp
        if (sort) {
            Object.entries(sort).forEach(([key, order]) => {
                qb.orderBy(`product.${key}`, order as 'ASC' | 'DESC');
            });
        }


        return await paginate(qb, page, limit);
    }

    async delete(id: string, req: any) {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }
        await this.productRepository.delete(id);
        return product;
    }
}
