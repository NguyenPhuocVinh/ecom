import {
    BadRequestException,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { typeormTransactionHandler } from 'src/common/function-helper/transaction';

import { SpuEntity } from './entities-v2/spu.entity';
import { SkuEntity } from './entities-v2/sku.entity';
import { SkuAttributeEntity } from './entities-v2/sku-attribute.entity';
import { AttributeValueEntity } from './entities-v2/attribute-value.entity';
import { StoreInventoryEntity } from '../stores/entities/store-inventory.entity';
import { StoreEntity } from '../stores/entities/store.entity';
import { Attribute } from './entities-v2/attribute.entity';

export class ProductServiceV2 {
    private readonly logger = new Logger(ProductServiceV2.name);

    constructor(
        @InjectRepository(SpuEntity)
        private spuRepository: Repository<SpuEntity>,

        @InjectRepository(SkuEntity)
        private skuRepository: Repository<SkuEntity>,

        @InjectRepository(StoreInventoryEntity)
        private storeInventoryRepository: Repository<StoreInventoryEntity>,

        @InjectRepository(SkuAttributeEntity)
        private skuAttributeRepository: Repository<SkuAttributeEntity>,

        @InjectRepository(Attribute)
        private attributeRepository: Repository<Attribute>,

        @InjectRepository(AttributeValueEntity)
        private attributeValueRepository: Repository<AttributeValueEntity>,

        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) { }

    async createProduct(dto: any): Promise<SpuEntity> {
        return typeormTransactionHandler<SpuEntity>(
            async (manager: EntityManager): Promise<SpuEntity> => {
                const spu = manager.create(SpuEntity, {
                    name: dto.name,
                    description: dto.description,
                    category: { id: dto.category_id },
                    images: [],
                });
                await manager.save(spu);

                if (dto.skus && dto.skus.length > 0) {
                    for (const skuDto of dto.skus) {
                        await this.createSku(manager, spu, skuDto);
                    }
                }

                return spu;
            },
            (error) => {
                throw error;
            },
            this.dataSource,
        ).then(async (spu) => {
            return this.spuRepository.findOne({
                where: { id: spu.id },
                relations: [
                    'category',
                    'skus',
                    'images',
                    'skus.attributes',
                    'skus.attributes.attribute',
                    'skus.attributes.attribute_value',
                    'skus.inventories',
                ],
            });
        });
    }

    private async createSku(
        manager: EntityManager,
        spu: SpuEntity,
        dto: any,
    ): Promise<SkuEntity> {
        if (dto.sku_code) {
            const existingSku = await manager.findOne(SkuEntity, {
                where: { sku_code: dto.sku_code },
            });
            if (existingSku) {
                throw new BadRequestException(`SKU code ${dto.sku_code} already exists`);
            }
        }

        const sku = manager.create(SkuEntity, {
            spu,
            sku_code: dto.sku_code,
            price: dto.price,
            weight: dto.weight,
            dimensions: dto.dimensions,
            images: [],
        });
        const savedSku = await manager.save(sku);

        if (dto.attributes && dto.attributes.length > 0) {
            for (const attrDto of dto.attributes) {
                await this.createSkuAttribute(manager, savedSku, attrDto);
            }
        }

        if (dto.inventories && dto.inventories.length > 0) {
            for (const invDto of dto.inventories) {
                await this.createStoreInventory(manager, savedSku, invDto);
            }
        }
        return savedSku;
    }

    private async createSkuAttribute(
        manager: EntityManager,
        sku: SkuEntity,
        dto: any,
    ): Promise<SkuAttributeEntity> {
        let attribute = dto.attribute_id
            ? await manager.findOne(Attribute, { where: { id: dto.attribute_id } })
            : undefined;

        if (!attribute && dto.attribute_name) {
            attribute = manager.create(Attribute, { name: dto.attribute_name });
            await manager.save(attribute);
        }

        if (!attribute) {
            throw new NotFoundException(`Attribute not found or missing`);
        }

        let attributeValue = dto.attribute_value_id
            ? await manager.findOne(AttributeValueEntity, {
                where: {
                    id: dto.attribute_value_id,
                    attribute: { id: attribute.id },
                },
            })
            : undefined;

        if (!attributeValue && dto.attribute_value_name) {
            attributeValue = manager.create(AttributeValueEntity, {
                value: dto.attribute_value_name,
                attribute: attribute,
            });
            await manager.save(attributeValue);
        }

        if (!attributeValue) {
            throw new NotFoundException(`Attribute value not found or missing`);
        }

        const skuAttribute = manager.create(SkuAttributeEntity, {
            sku: { id: sku.id },
            attribute,
            attribute_value: attributeValue,
        });
        return manager.save(skuAttribute);
    }

    private async createStoreInventory(
        manager: EntityManager,
        sku: SkuEntity,
        dto: any,
    ): Promise<StoreInventoryEntity> {
        const store = await manager.findOne(StoreEntity, {
            where: { id: dto.store_id },
        });

        if (!store) {
            throw new NotFoundException(`Store with ID ${dto.store_id} not found`);
        }

        const inventory = manager.create(StoreInventoryEntity, {
            store,
            sku,
            stock_quantity: dto.stock_quantity,
        });
        return manager.save(inventory);
    }

    async getProductById(id: string): Promise<SpuEntity> {
        const product = await this.spuRepository.findOne({
            where: { id },
            relations: [
                'category',
                'skus',
                'images',
                'skus.attributes',
                'skus.attributes.attribute',
                'skus.attributes.attribute_value',
                'skus.inventories',
            ],
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        return product;
    }

    async updateProduct(id: string, dto: any): Promise<SpuEntity> {
        return typeormTransactionHandler<SpuEntity>(
            async (manager: EntityManager): Promise<SpuEntity> => {
                const product = await this.getProductById(id);
                if (!product) {
                    throw new NotFoundException(`Product with ID ${id} not found`);
                }

                // Update product properties
                product.name = dto.name;
                product.description = dto.description;
                if (product.category) {
                    product.category.id = dto.category_id;
                }
                await manager.save(product);

                // Update SKUs and their attributes
                if (dto.skus && dto.skus.length > 0) {
                    for (const skuDto of dto.skus) {
                        await this.updateSku(manager, product, skuDto);
                    }
                }

                return product;
            },
            (error) => {
                throw error;
            },
            this.dataSource,
        ).then(async (spu) => {
            return this.spuRepository.findOne({
                where: { id: spu.id },
                relations: [
                    'category',
                    'skus',
                    'images',
                    'skus.attributes',
                    'skus.attributes.attribute',
                    'skus.attributes.attribute_value',
                    'skus.inventories',
                ],
            });
        });
    }

    private async updateSku(
        manager: EntityManager,
        spu: SpuEntity,
        dto: any,
    ): Promise<SkuEntity> {
        const sku = await manager.findOne(SkuEntity, {
            where: { id: dto.id, spu },
        });

        if (!sku) {
            throw new NotFoundException(`SKU with ID ${dto.id} not found`);
        }

        // Update SKU properties
        sku.sku_code = dto.sku_code;
        sku.price = dto.price;

        await manager.save(sku);

        // Update SKU attributes
        if (dto.attributes && dto.attributes.length > 0) {
            for (const attrDto of dto.attributes) {
                await this.updateSkuAttribute(manager, sku, attrDto);
            }
        }

        return sku;
    }
    private async updateSkuAttribute(
        manager: EntityManager,
        sku: SkuEntity,
        dto: any,
    ): Promise<SkuAttributeEntity> {
        const skuAttribute = await manager.findOne(SkuAttributeEntity, {
            where: { id: dto.id, sku },
        });

        if (!skuAttribute) {
            throw new NotFoundException(`SKU Attribute with ID ${dto.id} not found`);
        }

        // Update SKU attribute properties
        skuAttribute.attribute = { id: dto.attribute_id };
        skuAttribute.attribute_value = { id: dto.attribute_value_id };
        return manager.save(skuAttribute);
    }

    async deleteProduct(id: string): Promise<void> {
        return typeormTransactionHandler<void>(
            async (manager: EntityManager): Promise<void> => {
                const product = await this.getProductById(id);
                if (!product) {
                    throw new NotFoundException(`Product with ID ${id} not found`);
                }

                await manager.remove(product);
            },
            (error) => {
                throw error;
            },
            this.dataSource,
        );
    }
}