import { Module } from '@nestjs/common';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity } from './entities/store.entity';
import { InventoryEntity } from '../inventories/entities/inventory.entity';
import { StoreManagerEntity } from './entities/store-manager.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { DiscountEntity } from '../discounts/entities/discounts.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StoreEntity,
      InventoryEntity,
      StoreManagerEntity,
      ProductEntity,
      DiscountEntity
    ])
  ],
  controllers: [StoresController],
  providers: [StoresService],
  exports: [StoresService]
})
export class StoresModule { }
