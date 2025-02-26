import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { InventoryEntity } from '../inventories/entities/inventory.entity';
import { DataSource, Repository } from 'typeorm';
import { CartItemEntity } from '../carts/entities/cart-item.entity';
import { CartEntity } from '../carts/entities/cart.entity';

@Injectable()
export class CheckoutService {
    private readonly logger = new Logger(CheckoutService.name);
    constructor(
        @InjectRepository(InventoryEntity)
        private readonly inventoryRepository: Repository<InventoryEntity>,

        @InjectRepository(CartItemEntity)
        private readonly cartItemRepository: Repository<CartItemEntity>,

        @InjectRepository(CartEntity)
        private readonly cartRepository: Repository<CartEntity>,

        @InjectDataSource() private readonly dataSource: DataSource
    ) { }

    async reviewCheckout(cartId: string, storeId: string, req: any) {

    }
}
