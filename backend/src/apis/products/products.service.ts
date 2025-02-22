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

        @InjectDataSource() private readonly dataSource: DataSource,
    ) { }

    /* 
        1. Tạo mới một sản phẩm
        2. Tạo mới một giá gốc cho sản phẩm
        3. Tạo mới một item trong kho cho sản phẩm
    */
    async create(createProductDto: CreateProductDto, req: any): Promise<ProductEntity> {
        const {
            name,
            price,
            categoryId,
            longDescription,
            shortDescription,
            quantity,
            featuredImages,
            store
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

                const priceEntity = this.priceRepository.create({
                    rootPrice: price,
                    product: createdProduct,
                });
                await manager.save(PriceEntity, priceEntity);

                const inventory = this.inventoryRepository.create({
                    quantity,
                    product: createdProduct,
                });
                await manager.save(InventoryEntity, inventory);
            },
            (error) => {
                this.logger.error('Error during product creation', error.stack);
                throw new BadRequestException(error);
            },
            this.dataSource
        );

        return await this.getById(createdProduct.id);
    }


    async getById(id: string): Promise<ProductEntity> {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['category', 'inventory', 'featuredImages'],
        });
        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }
        return product;
    }
}
