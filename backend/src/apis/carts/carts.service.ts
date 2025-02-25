import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { DataSource, Repository } from 'typeorm';
import { CartItemEntity } from './entities/cart-item.entity';
import { typeormTransactionHandler } from 'src/common/function-helper/transaction';
import { AddProductToCartDto } from './entities/dto/add-product.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { InventoryEntity } from '../inventories/entities/inventory.entity';
import { UpdateCartItemDto } from './entities/dto/update-cartItem.dto';

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

        @InjectDataSource() private readonly dataSource: DataSource,

    ) { }

    async createCart(user: any) {
        const newCart = this.cartRepository.create({
            user: { id: user.id },
            totalPrice: 0,
            totalQuantity: 0
        });
        return await this.cartRepository.save(newCart);
    }

    async addProductToCart(data: AddProductToCartDto, user: any) {
        const { product, quantity } = data;
        const { productId, attribute, variant } = product;
        const cart = await this.cartRepository.findOne({ where: { user: { id: user.id } } });
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

        const inventory = foundProduct.attributes[0].variants[0].inventory;
        const price = foundProduct.attributes[0].variants[0].price.rootPrice;

        let newCart = null;
        if (!cart) {
            newCart = this.createCart(user);
        }
        typeormTransactionHandler(async (manager) => {
            const cartItem = await this.cartItemRepository.findOne({
                where: {
                    cart: { id: cart.id || newCart.id },
                    product: { id: productId },
                }
            })
            if (cartItem) {
                cartItem.quantity += quantity;
                await manager.save(CartItemEntity, cartItem);
            } else {
                const newCartItem = this.cartItemRepository.create({
                    cart: { id: cart.id || newCart.id },
                    product: { id: productId },
                    quantity,
                    price
                });
                await manager.save(CartItemEntity, newCartItem);
            }
            await this.inventoryRepository.update({ id: inventory.id }, { quantity: inventory.quantity - quantity, reservedQuantity: inventory.reservedQuantity + quantity });
            await this.cartRepository.update({ id: cart.id || newCart.id }, { totalPrice: cart.totalPrice + Number(price) * quantity, totalQuantity: cart.totalQuantity + quantity });
        },
            (error) => {
                throw error;
            },
            this.dataSource
        )
        return this.getCartDetail(user);
    }

    async getCartDetail(user: any) {
        const cart = await this.cartRepository.findOne({ where: { user: { id: user.id } } });
        if (!cart) return null;
        const items = await this.cartItemRepository.find({ where: { cart: { id: cart.id } } });
        return { ...cart, items };
    }

    async updateCartItem(id: string, data: UpdateCartItemDto, user: any) {
        const { product, quantity } = data;
        const { productId, attribute, variant } = product;

        const cart = await this.cartRepository.findOne({ where: { user: { id: user.id }, id } });
        if (!cart) throw new NotFoundException('CART_NOT_FOUND');

        const cartItem = await this.cartItemRepository.findOne({
            where: {
                cart: { id: cart.id },
                product: { id: productId },
            }
        })
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

        const inventory = foundProduct.attributes[0].variants[0].inventory;
        const price = foundProduct.attributes[0].variants[0].price.rootPrice;
        typeormTransactionHandler(async (manager) => {
            await this.inventoryRepository.update({ id: inventory.id }, { quantity: inventory.quantity - quantity, reservedQuantity: inventory.reservedQuantity + quantity });
            await this.cartRepository.update({ id: cart.id }, { totalPrice: cart.totalPrice + Number(price) * quantity, totalQuantity: cart.totalQuantity + quantity });
            await manager.save(CartItemEntity, { ...cartItem, quantity: cartItem.quantity + quantity });
        },
            (error) => {
                throw error;
            },
            this.dataSource
        )
    }
}
