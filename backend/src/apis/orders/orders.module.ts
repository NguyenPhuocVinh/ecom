import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { CartEntity } from '../carts/entities/cart.entity';
import { CartItemEntity } from '../carts/entities/cart-item.entity';
import { InventoryEntity } from '../inventories/entities/inventory.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { UserEntity } from '../users/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderItemEntity,
      InventoryEntity,
      CartItemEntity,
      CartEntity,
      ProductEntity,
      UserEntity
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule { }
