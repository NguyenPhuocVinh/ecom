import { UserEntity } from "src/apis/users/entities/users.entity";
import { STATUS } from "src/common/constants/enum";
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { AggregateRootEntity } from "./aggregate-root.entity";

export class CreatedByRootEntity extends AggregateRootEntity {
    @ManyToOne(() => UserEntity, { nullable: true })
    @JoinColumn({ name: 'created_by' })
    created_by: UserEntity;

    @ManyToOne(() => UserEntity, { nullable: true })
    @JoinColumn({ name: 'updated_by' })
    updated_by: UserEntity;

    @BeforeUpdate()
    updateTimestamp() {
        this.updated_at = new Date();
    }
    @BeforeInsert()
    setCreatedAt() {
        this.created_at = new Date();
    }
}
