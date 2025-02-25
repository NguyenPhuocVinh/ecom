import { ENTITY_NAME } from "src/common/constants/enum";
import { BaseEntity } from "src/cores/entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { CartEntity } from "./cart.entity";
import { ProductEntity } from "src/apis/products/entities/product.entity";

@Entity({ name: ENTITY_NAME.CART_ITEM })
export class CartItemEntity extends BaseEntity {
    @ManyToOne(() => CartEntity, cart => cart.items)
    cart: CartEntity;

    @Column()
    price: number;

    @Column()
    quantity: number;

    @ManyToOne(() => ProductEntity, product => product.cartItem)
    @JoinColumn()
    product: ProductEntity;
}