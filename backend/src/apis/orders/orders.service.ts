import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { OrderItemEntity } from './entities/order-item.entity';
import { CartEntity } from '../carts/entities/cart.entity';
import { CartItemEntity } from '../carts/entities/cart-item.entity';
import { InventoryEntity } from '../inventories/entities/inventory.entity';
import { CreateOrderDto } from './entities/dto/create-order.dto';
import { typeormTransactionHandler } from 'src/common/function-helper/transaction';
import { ProductEntity } from '../products/entities/product.entity';

@Injectable()
export class OrdersService {
    private readonly logger = new Logger(OrdersService.name);

    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,

        @InjectRepository(OrderItemEntity)
        private readonly orderItemRepository: Repository<OrderItemEntity>,

        @InjectRepository(CartEntity)
        private readonly cartRepository: Repository<CartEntity>,

        @InjectRepository(CartItemEntity)
        private readonly cartItemRepository: Repository<CartItemEntity>,

        @InjectRepository(InventoryEntity)
        private readonly inventoryRepository: Repository<InventoryEntity>,

        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,

        @InjectDataSource()
        private readonly dataSource: DataSource
    ) { }

    async createOrder(data: CreateOrderDto, user: any) {
        const { cartId, items, firstName, lastName, shippingAddress, phone, storeId } = data;

        const cart = await this.cartRepository.findOne({
            where: {
                id: cartId,
                ...(user && { user: { id: user.id } })
            },
            relations: [
                'items',
                'items.product',
                'items.product.attributes',
                'items.product.attributes.featuredImages',
                'items.product.attributes.variants',
                'items.product.attributes.variants.featuredImages',
            ],
        });

        if (!cart) throw new BadRequestException('CAN_NOT_FIND_CART');
        if (cart.items.length === 0) throw new BadRequestException('CART_IS_EMPTY');

        const cartProductIds = cart.items.map(cartItem => cartItem.id);
        const invalidProducts = items.filter(productId => !cartProductIds.includes(productId));

        if (invalidProducts.length > 0) {
            throw new BadRequestException('SOME_PRODUCTS_ARE_NOT_IN_CART');
        }

        const selectedItems = cart.items.filter(cartItem => items.includes(cartItem.id));

        if (selectedItems.length === 0) {
            throw new BadRequestException('NO_VALID_PRODUCTS_SELECTED');
        }

        const totalAmount = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const totalQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

        await typeormTransactionHandler(
            async (manager) => {
                const order = manager.create(OrderEntity, {
                    user: user ? { id: user.id } : null,
                    userInfo: {
                        firstName,
                        lastName,
                        fullName: `${lastName} ${firstName}`,
                        shippingAddress,
                        phone,
                    },
                    totalAmount,
                    totalQuantity,
                });
                await manager.save(order);

                const orderItems = selectedItems.map(cartItem => {
                    const product = cartItem.product;
                    if (!product) return null;

                    const attribute = product.attributes.find(attr => attr.code === cartItem.attribute);
                    const variant = attribute?.variants.find(v => v.code === cartItem.variant);
                    console.log("🚀 ~ OrdersService ~ variant:", variant.featuredImages)

                    return manager.create(OrderItemEntity, {
                        order,
                        product,
                        productOrder: {
                            name: product.name,
                            price: cartItem.price,
                            quantity: cartItem.quantity,
                            featuredImage: {
                                title: variant?.featuredImages?.[0]?.title || null,
                                secure_url: variant?.featuredImages?.[0]?.url || null,
                                alt: variant?.featuredImages?.[0]?.alt || null,
                                url: variant?.featuredImages?.[0]?.url || null,
                            },
                            longDescription: product.longDescription,
                            shortDescription: product.shortDescription,
                            attribute: attribute ? {
                                key: attribute.key,
                                value: attribute.value,
                                variant: variant ? {
                                    key: variant.key,
                                    value: variant.value
                                } : null
                            } : null
                        }
                    });
                }).filter(item => item !== null);

                await manager.save(orderItems);

                await Promise.all([
                    ...selectedItems.map(async (cartItem) => {
                        const product = cartItem.product;
                        if (!product) return;

                        const updatedInventory = await manager.createQueryBuilder(InventoryEntity, 'inventory')
                            .select('inventory.id, inventory.quantity')
                            .leftJoin('inventory.variant', 'variant')
                            .leftJoin('variant.attribute', 'attribute')
                            .leftJoin('attribute.product', 'product')
                            .leftJoin('inventory.store', 'store')
                            .where('product.id = :productId', { productId: product.id })
                            .andWhere('attribute.code = :attribute', { attribute: cartItem.attribute })
                            .andWhere('variant.code = :variant', { variant: cartItem.variant })
                            .andWhere('store.id = :storeId', { storeId })
                            .getRawOne();

                        await manager.update(
                            InventoryEntity,
                            updatedInventory.id,
                            {
                                quantity: updatedInventory.quantity - cartItem.quantity,
                            }
                        );
                    }),

                    manager.createQueryBuilder()
                        .delete()
                        .from(CartItemEntity)
                        .where("id IN (:...ids)", { ids: items })
                        .execute()
                ]);

                const remainingCartItems = await manager.find(
                    CartItemEntity,
                    {
                        where: {
                            cart: { id: cart.id }
                        }
                    }
                );

                await manager.update(
                    CartEntity,
                    cart.id,
                    {
                        totalPrice: remainingCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
                        totalQuantity: remainingCartItems.reduce((sum, item) => sum + item.quantity, 0),
                    }
                );
            },
            (error) => {
                this.logger.error(error);
                throw new BadRequestException('CREATE_ORDER_FAILED');
            },
            this.dataSource,
        );

        return true;
    }
    async getOrderDetail(orderId: string) {
        return this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['items'],
        });
    }
}
