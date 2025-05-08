import { DISCOUNT_CONDITION, DISCOUNT_STATUS, DISCOUNT_TYPE, ENTITY_NAME } from "src/common/constants/enum";
import { CreatedByRootEntity } from "src/cores/entities/created-by-root.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { UserEntity } from "../../users/entities/users.entity";
import { StoreEntity } from "../../stores/entities/store.entity";

@Entity({ name: ENTITY_NAME.DISCOUNT })
export class DiscountEntity extends CreatedByRootEntity {
    @ManyToOne(() => UserEntity, user => user.discounts)
    user: UserEntity;

    @Column()
    code: string;

    @Column()
    value: number;

    @Column({ enum: DISCOUNT_TYPE, default: DISCOUNT_TYPE.PERCENT })
    type: DISCOUNT_TYPE;

    @Column({ nullable: true })
    expiredAt: Date;

    @Column()
    startDay: Date;

    @Column({ enum: DISCOUNT_CONDITION, default: DISCOUNT_CONDITION.ALL })
    condition: DISCOUNT_CONDITION;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    limit: number;

    @Column({ default: 0 })
    used: number;

    @Column({ enum: DISCOUNT_STATUS, default: DISCOUNT_STATUS.ACTIVED })
    status: DISCOUNT_STATUS;

    @Column({ nullable: true })
    maxDiscount: number;

    @ManyToOne(() => StoreEntity, store => store.discounts, { nullable: true })
    store: StoreEntity;
}