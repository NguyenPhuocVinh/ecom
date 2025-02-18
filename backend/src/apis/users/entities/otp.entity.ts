import { ENTITY_NAME } from "src/common/constants/enum";
import { BaseEntity } from "src/cores/entities/base.entity";
import { Column, Entity, OneToOne } from "typeorm";
import { UserEntity } from "./users.entity";

@Entity({ name: ENTITY_NAME.OTP })
export class OtpEntity extends BaseEntity {
    @OneToOne(() => UserEntity, (user) => user.otp)
    user: UserEntity;

    @Column()
    otp: string;
}