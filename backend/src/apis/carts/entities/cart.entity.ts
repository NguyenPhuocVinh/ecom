import { ENTITY_NAME } from "src/common/constants/enum";
import { BaseEntity } from "src/cores/entities/base.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { CartItemEntity } from "./cart-item.entity";
import { UserEntity } from "src/apis/users/entities/users.entity";

@Entity({ name: ENTITY_NAME.CART })
export class CartEntity extends BaseEntity {
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