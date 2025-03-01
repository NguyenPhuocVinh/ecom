import { OrderEntity } from "src/apis/orders/entities/order.entity";
import { ENTITY_NAME, PAYMENT_METHOD, PAYMENT_STATUS } from "src/common/constants/enum";
import { BaseEntity } from "src/cores/entities/base.entity";
import { Column, Entity, OneToOne } from "typeorm";

@Entity({ name: ENTITY_NAME.PAYMENT })
export class PaymentEntity extends BaseEntity {
    @OneToOne(() => OrderEntity, order => order.payment)
    order: OrderEntity;

    @Column({ enum: PAYMENT_METHOD })
    method: PAYMENT_METHOD;

    @Column({ nullable: true })
    transactionId: string;

    @Column({ enum: PAYMENT_STATUS })
    status: PAYMENT_STATUS;

    @Column()
    amount: number;

    @Column({ type: 'jsonb' })
    paymentInformation: string;


}