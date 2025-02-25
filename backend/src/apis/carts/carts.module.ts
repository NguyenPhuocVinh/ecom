import { Module } from '@nestjs/common';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { CartItemEntity } from './entities/cart-item.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { InventoryEntity } from '../inventories/entities/inventory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CartEntity,
      CartItemEntity,
      ProductEntity,
      InventoryEntity
    ])
  ],
  controllers: [CartsController],
  providers: [CartsService]
})
export class CartsModule { }
