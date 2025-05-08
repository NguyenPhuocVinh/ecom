import { Logger } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { CartEntity } from "./entitiesv2/cart.entity";
import { CartItemEntity } from "./entitiesv2/cart-item.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { SkuEntity } from "../products/entities-v2/sku.entity";
import { ProductServiceV2 } from "../products/product.service.v2";
import { typeormTransactionHandler } from "src/common/function-helper/transaction";

export class CartServiceV2 {
    private logger = new Logger(CartServiceV2.name);
    constructor(
        @InjectRepository(CartEntity)
        private readonly cartRepository: Repository<CartEntity>,
        @InjectRepository(CartItemEntity)
        private readonly cartItemRepository: Repository<CartItemEntity>,
        @InjectRepository(SkuEntity)
        private readonly skuRepository: Repository<SkuEntity>,
        private readonly dataSource: DataSource,
        private readonly productService: ProductServiceV2,
    ) { }

    private async createCart(user: any) {
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

    async addProductToCart(data: any, req: any) {
        console.log("🚀 ~ CartServiceV2 ~ addProductToCart ~ req:", req.user)
        const { sku_id, quantity } = data;
        const cart = await this.cartRepository.findOne(
            {
                where: {
                    user: {
                        id: req.user.id

                    }
                }
            }
        )
        console.log("🚀 ~ CartServiceV2 ~ addProductToCart ~ data:", data)
        if (!cart) await this.createCart(req.user);

        const skuProduct = await this.productService.getProductBySkuId(sku_id);
        await typeormTransactionHandler(async (manager) => {
            const cartItem = await this.cartItemRepository.findOne({
                where: {
                    cart: { id: cart.id },
                    sku: { id: skuProduct.id }
                }
            })
            if (cartItem) {
                console.log("🚀 ~ CartServiceV2 ~ awaittypeormTransactionHandler ~ cartItem:", cartItem)
                cartItem.quantity += quantity;
                await manager.save(CartItemEntity, cartItem);
            } else {
                const newCartItem = this.cartItemRepository.create({
                    cart: { id: cart.id },
                    sku: { id: skuProduct.id },
                    price: Number(skuProduct.price),
                    quantity: quantity
                });
                await manager.save(CartItemEntity, newCartItem);
            }
            await this.cartRepository.update(
                {
                    id: cart.id
                },
                {
                    totalPrice: cart.totalPrice + Number(skuProduct.price) * quantity,
                    totalQuantity: cart.totalQuantity + quantity
                });
        },
            (error) => {
                throw error;
            },
            this.dataSource
        )
        return await this.getCartDetail(cart.id, req);

    }

    async getCartDetail(id: string, req: any) {
        const cart = await this.cartRepository.findOne({
            where: {
                user: { id: req.user.id },
                id: id
            },
            relations: ['items', 'items.sku', 'items.sku.attributes', 'items.sku.images', 'items.sku.attributes.attribute', 'items.sku.attributes.attribute_value'],
        });

        return cart || null;
    }

    async updateCartItem(id: string, data: any, req: any) {
        const { sku_id, quantity } = data;

        const cart = await this.cartRepository.findOne({
            where: {
                user: { id: req.user.id },
                id: id
            },
        })

        if (!cart) return null;
        await typeormTransactionHandler(async (manager) => {
            const cartItem = await this.cartItemRepository.findOne({
                where: {
                    cart: { id: cart.id },
                    sku: { id: sku_id }
                }
            });
            if (!cartItem) {
                return null;
            }

            const oldQuantity = cartItem.quantity;
            const newQuantity = oldQuantity + quantity;

            if (newQuantity <= 0) {
                await manager.delete(CartItemEntity, { id: cartItem.id });

                cart.totalQuantity -= oldQuantity;
                cart.totalPrice -= cartItem.price * oldQuantity;
            } else {
                cartItem.quantity = newQuantity;
                await manager.save(CartItemEntity, cartItem);

                const deltaQuantity = newQuantity - oldQuantity;
                cart.totalQuantity += deltaQuantity;
                cart.totalPrice += deltaQuantity * cartItem.price;
            }

            await manager.save(CartEntity, cart);

        },
            (error) => {
                throw error;
            },
            this.dataSource
        )
        return await this.getCartDetail(cart.id, req);
    }
}