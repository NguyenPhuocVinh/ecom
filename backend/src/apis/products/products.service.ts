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

    async create(createProductDto: CreateProductDto, req: any): Promise<ProductEntity> {
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
                                key: attrDto.key,
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
                                            key: variantDto.key,
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

    async getDetail(id: string): Promise<ProductEntity> {
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
        return product;
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

}
