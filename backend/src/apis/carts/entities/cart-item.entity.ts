import { ENTITY_NAME } from "src/common/constants/enum";
import { BaseEntity } from "src/cores/entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { CartEntity } from "./cart.entity";
import { ProductEntity } from "src/apis/products/entities/product.entity";

@Entity({ name: ENTITY_NAME.CART_ITEM })
export class CartItemEntity extends BaseEntity {
    @ManyToOne(() => CartEntity, cart => cart.items, { onDelete: "CASCADE" })
    cart: CartEntity;

    @Column()
    price: number;

    @Column()
    quantity: number;

    @ManyToOne(() => ProductEntity, product => product.id, { onDelete: "CASCADE" })
    @JoinColumn()
    product: ProductEntity;

    @Column()
    attribute: string;

    @Column()
    variant: string;
}