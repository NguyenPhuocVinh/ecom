import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryEntity } from '../inventories/entities/inventory.entity';
import { CartItemEntity } from '../carts/entities/cart-item.entity';
import { CartEntity } from '../carts/entities/cart.entity';
import { OrderEntity } from '../orders/entities/order.entity';
import { OrderItemEntity } from '../orders/entities/order-item.entity';
import { PaymentEntity } from './entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InventoryEntity,
      CartItemEntity,
      CartEntity,
      OrderEntity,
      OrderItemEntity,
      PaymentEntity
    ])
  ],
  controllers: [CheckoutController],
  providers: [CheckoutService]
})
export class CheckoutModule { }
