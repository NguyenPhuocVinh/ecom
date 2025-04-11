import { ENTITY_NAME } from "src/common/constants/enum";
import { RootEntity } from "src/cores/entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { CartEntity } from "./cart.entity";
import { ProductEntity } from "src/apis/products/entities/product-spu.entity";
import { SkuEntity } from "src/apis/products/entities-v2/sku.entity";

@Entity({ name: ENTITY_NAME.CART_ITEM })
export class CartItemEntity extends RootEntity {
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


    @ManyToOne(() => SkuEntity, (sku) => sku.cartItems)
    sku: SkuEntity;
}