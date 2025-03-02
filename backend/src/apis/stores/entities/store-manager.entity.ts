import { UserEntity } from "src/apis/users/entities/users.entity";
import { ENTITY_NAME, ROLE_STORE, STATUS } from "src/common/constants/enum";
import { BaseEntity } from "src/cores/entities/base.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { StoreEntity } from "./store.entity";

@Entity({ name: ENTITY_NAME.STORE_MANAGER })
export class StoreManagerEntity extends BaseEntity {

    @ManyToOne(() => UserEntity, user => user.store)
    user: UserEntity;

    @ManyToOne(() => StoreEntity, store => store.users, { onDelete: "CASCADE" })
    store: StoreEntity;

    @Column({ default: ROLE_STORE.OWNER })
    role: string;

    @Column({ default: STATUS.ACTIVED })
    status: string;
}