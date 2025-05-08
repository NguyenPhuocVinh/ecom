import { ENTITY_NAME } from "src/common/constants/enum";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { CartEntity } from "./cart.entity";
import { SkuEntity } from "src/apis/products/entities-v2/sku.entity";
import { AggregateRootEntity } from "src/cores/entities/aggregate-root.entity";

@Entity({ name: ENTITY_NAME.CART_ITEM })
export class CartItemEntity extends AggregateRootEntity {
    @ManyToOne(() => CartEntity, cart => cart.items, { onDelete: "CASCADE" })
    cart: CartEntity;

    @Column()
    price: number;

    @Column()
    quantity: number;

    @ManyToOne(() => SkuEntity, sku => sku.id, { onDelete: "CASCADE" })
    @JoinColumn()
    skuId: SkuEntity;

    @ManyToOne(() => SkuEntity, (sku) => sku.cart_items)
    sku: SkuEntity;
}