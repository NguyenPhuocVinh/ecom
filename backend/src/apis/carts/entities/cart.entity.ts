// import { ENTITY_NAME } from "src/common/constants/enum";
// import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
// import { CartItemEntity } from "./cart-item.entity";
// import { UserEntity } from "src/apis/users/entities/users.entity";
// import { StoreEntity } from "src/apis/stores/entities/store.entity";
// import { CreatedByRootEntity } from "src/cores/entities/created-by-root.entity";

// @Entity({ name: ENTITY_NAME.CART })
// export class CartEntity extends CreatedByRootEntity {
//     @OneToMany(() => CartItemEntity, item => item.cart)
//     items: CartItemEntity[];

//     @OneToOne(() => UserEntity, user => user.cart)
//     @JoinColumn()
//     user: UserEntity;

//     @Column()
//     totalPrice: number;

//     @Column()
//     totalQuantity: number;

// }