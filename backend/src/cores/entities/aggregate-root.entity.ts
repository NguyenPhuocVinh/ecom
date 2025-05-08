import { UserEntity } from "src/apis/users/entities/users.entity";
import { STATUS } from "src/common/constants/enum";
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

export class AggregateRootEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @BeforeUpdate()
    updateTimestamp() {
        this.updated_at = new Date();
    }
    @BeforeInsert()
    setCreatedAt() {
        this.created_at = new Date();
    }
}
