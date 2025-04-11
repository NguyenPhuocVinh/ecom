import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CartItemEntity } from './entities/cart-item.entity';
import { typeormTransactionHandler } from 'src/common/function-helper/transaction';
import { AddProductToCartDto } from './entities/dto/add-product.entity';
import { ProductEntity } from '../products/entities/product-spu.entity';
import { InventoryEntity } from '../inventories/entities/inventory.entity';
import { UpdateCartItemDto } from './entities/dto/update-cartItem.dto';
import { VariantEntity } from '../products/entities/variant.entity';

@Injectable()
export class CartsService {
    private readonly logger = new Logger(CartsService.name);
    constructor(
        @InjectRepository(CartEntity)
        private readonly cartRepository: Repository<CartEntity>,

        @InjectRepository(CartItemEntity)
        private readonly cartItemRepository: Repository<CartItemEntity>,

        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,

        @InjectRepository(InventoryEntity)
        private readonly inventoryRepository: Repository<InventoryEntity>,

        @InjectRepository(VariantEntity)
        private readonly variantRepository: Repository<VariantEntity>,

        @InjectDataSource() private readonly dataSource: DataSource,

    ) { }

    async createCart(user: any) {
        const newCart = this.cartRepository.create({
            user:
            {
                id: user.id
            },
            totalPrice: 0,
            totalQuantity: 0
        });
        return await this.cartRepository.save(newCart);
    }

    async addProductToCart(data: AddProductToCartDto, store: string, user: any) {
        const { product, quantity } = data;
        const { productId, attribute, variant } = product;
        let cart = await this.cartRepository.findOne(
            {
                where: {
                    user: {
                        id: user.id
                    }
                }
            }
        );
        if (!cart) {
            cart = await this.createCart(user);
        }

        const foundProduct = await this.productRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.attributes', 'attributes')
            .leftJoinAndSelect('attributes.variants', 'variants')
            .leftJoinAndSelect('variants.price', 'price')
            .where('product.id = :id', { id: productId })
            .andWhere('attributes.code = :attrCode', { attrCode: attribute })
            .andWhere('variants.code = :variantCode', { variantCode: variant })
            .getOne();
        if (!foundProduct) throw new NotFoundException('PRODUCT_NOT_FOUND');

        const price = foundProduct.attributes[0].variants[0].price.rootPrice;


        await typeormTransactionHandler(async (manager) => {
            const cartItem = await this.cartItemRepository.findOne({
                where: {
                    cart: { id: cart.id },
                    product: { id: productId },
                    attribute: attribute,
                    variant: variant
                }
            })
            if (cartItem) {
                cartItem.quantity += quantity;
                await manager.save(CartItemEntity, cartItem);
            } else {
                const newCartItem = this.cartItemRepository.create({
                    cart: { id: cart.id },
                    product: { id: productId },
                    quantity,
                    price,
                    variant,
                    attribute
                });
                await manager.save(CartItemEntity, newCartItem);
            }
            await this.cartRepository.update(
                {
                    id: cart.id
                },
                {
                    totalPrice: cart.totalPrice + Number(price) * quantity,
                    totalQuantity: cart.totalQuantity + quantity
                });
        },
            (error) => {
                throw error;
            },
            this.dataSource
        )
        return await this.getCartDetail(user);
    }

    async getCartDetail(user: any) {
        const cart = await this.cartRepository.findOne({ where: { user: { id: user.id } } });
        if (!cart) return null;
        const items = await this.cartItemRepository.createQueryBuilder('cartItem')
            .where('cartItem.cartId = :cartId', { cartId: cart.id })
            .leftJoinAndSelect('cartItem.product', 'product')
            .leftJoinAndSelect('product.attributes', 'attributes')
            .leftJoinAndSelect('attributes.variants', 'variants')
            .leftJoinAndSelect('variants.inventories', 'inventories')
            .andWhere('attributes.code = "cartItem"."attribute"')
            .andWhere('variants.code = "cartItem"."variant"')
            .getMany();

        return { ...cart, items };
    }

    async updateCartItem(id: string, data: UpdateCartItemDto, store: string, user: any) {
        const { product, quantity } = data;
        const { productId, attribute, variant } = product;

        const cart = await this.cartRepository.findOne({ where: { user: { id: user.id }, id } });
        if (!cart) throw new NotFoundException('CART_NOT_FOUND');

        const cartItem = await this.cartItemRepository.findOne({
            where: {
                cart: { id: cart.id },
                product: { id: productId },
            }
        });
        if (!cartItem) throw new NotFoundException('CART_ITEM_NOT_FOUND');

        const foundProduct = await this.productRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.attributes', 'attributes')
            .leftJoinAndSelect('attributes.variants', 'variants')
            .leftJoinAndSelect('variants.inventory', 'inventory')
            .leftJoinAndSelect('variants.price', 'price')
            .where('product.id = :id', { id: productId })
            .andWhere('attributes.code = :attrCode', { attrCode: attribute })
            .andWhere('variants.code = :variantCode', { variantCode: variant })
            .getOne();
        if (!foundProduct) throw new NotFoundException('PRODUCT_NOT_FOUND');

        const price = foundProduct.attributes[0].variants[0].price.rootPrice;

        await typeormTransactionHandler(
            async (manager: EntityManager) => {
                const newQuantity = cartItem.quantity + quantity;
                if (cartItem.attribute !== attribute || cartItem.variant !== variant) {
                    if (newQuantity <= 0) throw new BadRequestException('CART_ITEM_NOT_FOUND');
                    await manager.update(
                        CartItemEntity,
                        { id: cartItem.id },
                        {
                            attribute,
                            variant,
                            quantity,
                            price
                        }
                    )
                    await manager.update(
                        CartEntity,
                        { id: cart.id },
                        {
                            totalPrice: Number(cart.totalPrice) - Number(price) * cartItem.quantity + Number(price) * quantity,
                            totalQuantity: cart.totalQuantity - cartItem.quantity + quantity
                        }
                    )
                    return;
                }
                if (newQuantity <= 0) {
                    await manager.update(
                        CartEntity,
                        { id: cart.id },
                        {
                            totalPrice: Number(cart.totalPrice) - Number(price) * cartItem.quantity,
                            totalQuantity: cart.totalQuantity - cartItem.quantity
                        }
                    );
                    await manager.delete(CartItemEntity, { id: cartItem.id });
                    return;
                } else {
                    await manager.update(
                        CartItemEntity,
                        { id: cartItem.id },
                        {
                            quantity: newQuantity,
                            price
                        }
                    )
                    await manager.update(
                        CartEntity,
                        { id: cart.id },
                        {
                            totalPrice: Number(cart.totalPrice) + Number(price) * quantity,
                            totalQuantity: cart.totalQuantity + quantity
                        }
                    )
                }
            },
            (error) => {
                this.logger.error('Error during product update in cart', error.stack);
                throw new BadRequestException(error);
            },
            this.dataSource
        );
        return await this.getCartDetail(user);
    }
}