import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { DataSource, Not, Repository } from 'typeorm';
import { OrderItemEntity } from './entities/order-item.entity';
import { CartEntity } from '../carts/entities/cart.entity';
import { CartItemEntity } from '../carts/entities/cart-item.entity';
import { InventoryEntity } from '../inventories/entities/inventory.entity';
import { CreateOrderDto } from './entities/dto/create-order.dto';
import { typeormTransactionHandler } from 'src/common/function-helper/transaction';
import { ProductEntity } from '../products/entities/product-spu.entity';
import { PaymentEntity } from '../checkout/entities/payment.entity';
import { ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS } from 'src/common/constants/enum';
import Stripe from 'stripe';
import { appConfig } from 'src/configs/app.config';

const { stripe } = appConfig;

@Injectable()
export class OrdersService {
    private readonly logger = new Logger(OrdersService.name);
    private readonly stripeClient: Stripe;

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


        @InjectRepository(PaymentEntity)
        private readonly paymentRepository: Repository<PaymentEntity>,

        @InjectDataSource()
        private readonly dataSource: DataSource
    ) {
        this.stripeClient = new Stripe(stripe.secretKey, {
            apiVersion: '2025-02-24.acacia', // Sử dụng phiên bản ổn định (sửa từ '2025-02-24.acacia')
        });
    }

    async createOrder(data: CreateOrderDto, user?: any) {
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

        let order;
        await typeormTransactionHandler(
            async (manager) => {
                order = manager.create(OrderEntity, {
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
                    status: ORDER_STATUS.PENDING,
                });
                await manager.save(order);

                const orderItems = selectedItems.map(cartItem => {
                    const product = cartItem.product;
                    if (!product) return null;

                    const attribute = product.attributes.find(attr => attr.code === cartItem.attribute);
                    const variant = attribute?.variants.find(v => v.code === cartItem.variant);

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

                        if (!updatedInventory || updatedInventory.quantity < cartItem.quantity) {
                            throw new BadRequestException('INSUFFICIENT_STOCK');
                        }

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

        try {

            const paymentResponse = await this.paymentStripe(order.id);
            return paymentResponse; // Trả về URL thanh toán
        } catch (error) {
            this.logger.error('Payment failed', error);
            throw new BadRequestException('PAYMENT_FAILED');
        }
    }


    // create order for guest
    async createOrderForGuest(data: any) {
        return await typeormTransactionHandler(
            async (manager) => {
                const { items, firstName, lastName, shippingAddress, phone, storeId } = data;

                if (!items || items.length === 0) {
                    throw new BadRequestException('CART_IS_EMPTY');
                }

                // Lấy thông tin sản phẩm và kiểm tra tính hợp lệ
                const selectedItems = await Promise.all(
                    items.map(async (item) => {
                        const product = await manager.findOne(ProductEntity, {
                            where: { id: item.productId },
                            relations: ['attributes', 'attributes.variants', 'attributes.featuredImages', 'attributes.variants.featuredImages', 'attributes.variants.price'],
                        });

                        if (!product) throw new BadRequestException('PRODUCT_NOT_FOUND');

                        const attribute = product.attributes.find(attr => attr.code === item.attribute);
                        if (!attribute) throw new BadRequestException('ATTRIBUTE_NOT_FOUND');

                        const variant = attribute.variants.find(v => v.code === item.variant);
                        if (!variant) throw new BadRequestException('VARIANT_NOT_FOUND');

                        return {
                            product,
                            attribute,
                            variant,
                            quantity: item.quantity,
                            price: variant.price.rootPrice,
                        };
                    })
                );

                // Tính tổng tiền và tổng số lượng sản phẩm
                const totalAmount = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
                const totalQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

                // Tạo đơn hàng
                const order = manager.create(OrderEntity, {
                    user: null, // Guest user
                    userInfo: {
                        firstName,
                        lastName,
                        fullName: `${lastName} ${firstName}`,
                        shippingAddress,
                        phone,
                    },
                    totalAmount,
                    totalQuantity,
                    status: ORDER_STATUS.PENDING, // Cần thanh toán trước khi xác nhận
                });
                await manager.save(order);

                // Tạo danh sách sản phẩm trong đơn hàng
                const orderItems = selectedItems.map((item) => {
                    return manager.create(OrderItemEntity, {
                        order,
                        product: item.product,
                        productOrder: {
                            name: item.product.name,
                            price: item.price,
                            quantity: item.quantity,
                            featuredImage: {
                                title: item.variant.featuredImages?.[0]?.title || null,
                                secure_url: item.variant.featuredImages?.[0]?.url || null,
                                alt: item.variant.featuredImages?.[0]?.alt || null,
                                url: item.variant.featuredImages?.[0]?.url || null,
                            },
                            longDescription: item.product.longDescription,
                            shortDescription: item.product.shortDescription,
                            attribute: {
                                key: item.attribute.key,
                                value: item.attribute.value,
                                variant: {
                                    key: item.variant.key,
                                    value: item.variant.value,
                                },
                            },
                        },
                    });
                });

                await manager.save(orderItems);

                // Cập nhật tồn kho
                await Promise.all(
                    selectedItems.map(async (item) => {
                        const updatedInventory = await manager.createQueryBuilder(InventoryEntity, 'inventory')
                            .select('inventory.id, inventory.quantity')
                            .leftJoin('inventory.variant', 'variant')
                            .leftJoin('variant.attribute', 'attribute')
                            .leftJoin('attribute.product', 'product')
                            .leftJoin('inventory.store', 'store')
                            .where('product.id = :productId', { productId: item.product.id })
                            .andWhere('attribute.code = :attribute', { attribute: item.attribute.code })
                            .andWhere('variant.code = :variant', { variant: item.variant.code })
                            .andWhere('store.id = :storeId', { storeId })
                            .getRawOne();

                        if (!updatedInventory || updatedInventory.quantity < item.quantity) {
                            throw new BadRequestException('INSUFFICIENT_STOCK');
                        }

                        await manager.update(
                            InventoryEntity,
                            updatedInventory.id,
                            { quantity: updatedInventory.quantity - item.quantity }
                        );
                    })
                );

                // **Gọi thanh toán Stripe sau khi tạo đơn hàng thành công**
                try {

                    const paymentResponse = await this.paymentStripe(order);
                    return paymentResponse; // Trả về URL thanh toán cho khách
                } catch (error) {
                    this.logger.error('Payment failed', error);
                    throw new BadRequestException('PAYMENT_FAILED');
                }
            },
            (error) => {
                this.logger.error(error);
                throw new BadRequestException('CREATE_ORDER_FAILED');
            },
            this.dataSource
        );
    }


    private async paymentStripe(order: any) {
        // Tạo Checkout Session
        const session = await this.stripeClient.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'vnd',
                        product_data: {
                            name: `Đơn hàng ${order.id}`,
                            // description: order.items
                            //     .map(item => item.productOrder?.name || 'Unnamed product')
                            //     .join(', ') || 'No products',
                            // images: imageUrls.length > 0 ? imageUrls.slice(0, 1) : undefined, // Chỉ gửi nếu có URL hợp lệ, không gửi nếu rỗng
                        },
                        unit_amount: order.totalAmount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:5001/api/v1/orders/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:5001/cancel',
            metadata: { order_id: order.id },
        });

        // Lưu thông tin thanh toán
        const payment = await this.paymentRepository.findOne({
            where: {
                order: { id: order.id },
                status: Not(PAYMENT_STATUS.PAID),
            },
        });

        if (!payment) {
            const newPay = await this.paymentRepository.insert({
                order: { id: order.id },
                method: PAYMENT_METHOD.STRIPE,
                transactionId: session.id,
                status: PAYMENT_STATUS.PENDING,
                amount: order.totalAmount,
                paymentInformation: JSON.stringify(session),
            });
            console.log("🚀 ~ OrdersService ~ paymentStripe ~ newPay:", newPay)

        } else {
            await this.paymentRepository.update(payment.id, {
                transactionId: session.id,
                status: PAYMENT_STATUS.PENDING,
                amount: order.totalAmount,
                paymentInformation: JSON.stringify(session),
            });
        }

        return { url: session.url };
    }

    async handleSuccess(sessionId: string) {
        const session = await this.stripeClient.checkout.sessions.retrieve(sessionId)
        if (!session || session.payment_status !== 'paid') {
            throw new NotFoundException('Payment not found or not completed');
        }
        const orderId = session.metadata.order_id;
        const payment = await this.paymentRepository.findOne({
            where: { order: { id: orderId } },
        })
        console.log("🚀 ~ OrdersService ~ handleSuccess ~ payment:", payment)



        return { message: 'Payment completed' };
    }

    async getOrderDetail(orderId: string) {
        return this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['items'],
        });
    }
}
