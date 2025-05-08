import { Module } from '@nestjs/common';
import { CartsController } from './carts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../products/entities/product-spu.entity';
import { InventoryEntity } from '../inventories/entities/inventory.entity';
import { VariantEntity } from '../products/entities/variant.entity';
import { CartServiceV2 } from './cart.service.v2';
import { CartEntity } from './entitiesv2/cart.entity';
import { CartItemEntity } from './entitiesv2/cart-item.entity';
import { ProductsModule } from '../products/products.module';
import { SkuEntity } from '../products/entities-v2/sku.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      InventoryEntity,
      VariantEntity,
      CartEntity,
      CartItemEntity,
      SkuEntity
    ]),
    ProductsModule,
  ],
  controllers: [CartsController],
  providers: [
    CartServiceV2
  ]
})
export class CartsModule { }
