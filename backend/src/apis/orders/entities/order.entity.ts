import { ENTITY_NAME, ORDER_STATUS } from "src/common/constants/enum";
import { BaseEntity } from "src/cores/entities/base.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { OrderItemEntity } from "./order-item.entity";
import { UserEntity } from "src/apis/users/entities/users.entity";

@Entity({ name: ENTITY_NAME.ORDER })
export class OrderEntity extends BaseEntity {
    @OneToMany(() => OrderItemEntity, item => item.order)
    items: OrderItemEntity[];

    @ManyToOne(() => UserEntity, user => user.id)
    user: UserEntity;

    @Column()
    totalAmount: number;

    @Column()
    totalQuantity: number;

    @Column({ enum: ORDER_STATUS, default: ORDER_STATUS.PENDING })
    status: ORDER_STATUS;
}