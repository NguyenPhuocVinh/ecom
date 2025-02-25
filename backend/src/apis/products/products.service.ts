import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
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
            store,
            attributes,
        } = createProductDto;

        const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
        if (!category) {
            throw new NotFoundException('CATEGORY_NOT_FOUND');
        }

        const storeEntity = await this.storeRepository.findOne({ where: { id: store } });
        if (!storeEntity) throw new NotFoundException('STORE_NOT_FOUND');

        let createdProduct: ProductEntity;

        await typeormTransactionHandler(
            async (manager: EntityManager) => {
                const product = this.productRepository.create({
                    name,
                    longDescription,
                    shortDescription,
                    category,
                    store: storeEntity,
                    featuredImages: featuredImages ? featuredImages.map((id) => ({ id })) : [],
                });
                createdProduct = await manager.save(ProductEntity, product);

                if (attributes && attributes.length > 0) {
                    const attributeEntities = [];
                    for (const attrDto of attributes) {
                        const attrEntity = this.atributeRepository.create({
                            code: attrDto.code,
                            key: attrDto.key,
                            value: attrDto.value,
                            product: createdProduct,
                        });
                        attributeEntities.push(attrEntity);
                    }
                    const createdAttributes = await manager.save(AttributeEntity, attributeEntities);

                    for (let i = 0; i < attributes.length; i++) {
                        const attrDto = attributes[i];
                        const attrEntity = createdAttributes[i];
                        if (attrDto.variants && attrDto.variants.length > 0) {
                            for (const variantDto of attrDto.variants) {
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
                                });
                                const createdVariant = await manager.save(VariantEntity, variantEntity);

                                const inventoryEntity = this.inventoryRepository.create({
                                    variant: createdVariant,
                                    quantity: Number(variantDto.quantity),
                                });
                                await manager.save(InventoryEntity, inventoryEntity);
                            }
                        }
                    }
                }
            },
            (error) => {
                this.logger.error('Error during product creation', error.stack);
                throw new BadRequestException(error);
            },
            this.dataSource
        );

        return await this.productRepository.findOne({
            where: { id: createdProduct.id },
            relations: ['category', 'store', 'featuredImages', 'attributes', 'attributes.variants'],
        });
    }

    async getDetail(id: string): Promise<ProductEntity> {
        const product = await this.productRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.price', 'price')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.store', 'store')
            .leftJoinAndSelect('product.attributes', 'attributes')
            .leftJoinAndSelect('attributes.variants', 'variants')
            .leftJoinAndSelect('variants.price', 'variantPrice')
            .where('product.id = :id', { id })
            .getOne();
        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }
        return product;
    }

}
