import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { InventoriesModule } from '../inventories/inventories.module';
import { InventoryEntity } from '../inventories/entities/inventory.entity';
import { PriceEntity } from './entities/price.entity';
import { CategoryEntity } from '../categories/entities/category.entity';
import { StoreEntity } from '../stores/entities/store.entity';
import { AttributeEntity } from './entities/atribute.entity';
import { VariantEntity } from './entities/variant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      PriceEntity,
      InventoryEntity,
      CategoryEntity,
      StoreEntity,
      AttributeEntity,
      VariantEntity
    ]),
    InventoriesModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule { }
