import { ENTITY_NAME } from "src/common/constants/enum";
import { CreatedByRootEntity } from "src/cores/entities/created-by-root.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { UserEntity } from "./users.entity";

@Entity({ name: ENTITY_NAME.OTP })
export class OtpEntity extends CreatedByRootEntity {
    @Column()
    otp: string;

    @Column({ type: 'timestamptz', nullable: true })
    expirationTime: Date;

    @OneToOne(() => UserEntity, (user) => user.otp)
    @JoinColumn()
    user: UserEntity;

    // expired in 5 minutes
    static readonly EXPIRED_TIME = 5 * 60 * 1000;
    @BeforeInsert()
    setExpirationTime() {
        this.expirationTime = new Date(Date.now() + OtpEntity.EXPIRED_TIME);
    }

    @BeforeUpdate()
    updateExpirationTime() {
        this.expirationTime = new Date(Date.now() + OtpEntity.EXPIRED_TIME);
    }
}