import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
// import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product-spu.entity';
import { InventoriesModule } from '../inventories/inventories.module';
import { InventoryEntity } from '../inventories/entities/inventory.entity';
import { PriceEntity } from './entities/price.entity';
import { CategoryEntity } from '../categories/entities/category.entity';
import { StoreEntity } from '../stores/entities/store.entity';
import { AttributeEntity } from './entities/atribute.entity';
import { VariantEntity } from './entities/variant.entity';
import { SpuEntity } from './entities-v2/spu.entity';
import { SkuEntity } from './entities-v2/sku.entity';
import { AttributeValueEntity } from './entities-v2/attribute-value.entity';
import { SkuAttributeEntity } from './entities-v2/sku-attribute.entity';
import { ProductServiceV2 } from './product.service.v2';
import { StoresModule } from '../stores/stores.module';
import { StoreInventoryEntity } from '../stores/entities/store-inventory.entity';
import { Attribute } from './entities-v2/attribute.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      PriceEntity,
      InventoryEntity,
      CategoryEntity,
      StoreEntity,
      AttributeEntity,
      VariantEntity,

      //v2
      SpuEntity,
      SkuEntity,
      Attribute,
      AttributeValueEntity,
      SkuAttributeEntity,
      StoreInventoryEntity
    ]),
    StoresModule
  ],
  controllers: [ProductsController],
  providers: [
    // ProductsService,
    ProductServiceV2
  ],
  exports: [
    ProductServiceV2,
  ]

})
export class ProductsModule { }
