import { ENTITY_NAME, ORDER_STATUS } from "src/common/constants/enum";
import { CreatedByRootEntity } from "src/cores/entities/created-by-root.entity";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { OrderItemEntity } from "./order-item.entity";
import { UserEntity } from "src/apis/users/entities/users.entity";
import { PaymentEntity } from "src/apis/checkout/entities/payment.entity";
import { AggregateRootEntity } from "src/cores/entities/aggregate-root.entity";

@Entity({ name: ENTITY_NAME.ORDER })
export class OrderEntity extends AggregateRootEntity {
    @OneToMany(() => OrderItemEntity, item => item.order)
    items: OrderItemEntity[];

    @ManyToOne(() => UserEntity, { nullable: true })
    @JoinColumn()
    user: UserEntity;

    @Column({ type: 'jsonb' })
    userInfo: {
        firstName: string;
        lastName: string;
        fullName: string;
        email: string;
        shippingAddress: string;
        phone: string;
    };

    @Column()
    totalAmount: number;

    @Column()
    totalQuantity: number;

    @Column({ enum: ORDER_STATUS, default: ORDER_STATUS.PENDING })
    status: ORDER_STATUS;

    @OneToOne(() => PaymentEntity, payment => payment.order, { nullable: true })
    @JoinColumn()
    payment: PaymentEntity;

}