import { ENTITY_NAME } from "src/common/constants/enum";
import { RootEntity } from "src/cores/entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { CartItemEntity } from "./cart-item.entity";
import { UserEntity } from "src/apis/users/entities/users.entity";
import { StoreEntity } from "src/apis/stores/entities/store.entity";

@Entity({ name: ENTITY_NAME.CART })
export class CartEntity extends RootEntity {
    @OneToMany(() => CartItemEntity, item => item.cart)
    items: CartItemEntity[];

    @OneToOne(() => UserEntity, user => user.cart)
    @JoinColumn()
    user: UserEntity;

    @Column()
    totalPrice: number;

    @Column()
    totalQuantity: number;

}