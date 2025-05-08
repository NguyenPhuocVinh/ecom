import { UserEntity } from "src/apis/users/entities/users.entity";
import { ENTITY_NAME, ROLE_STORE, STATUS } from "src/common/constants/enum";
import { CreatedByRootEntity } from "src/cores/entities/created-by-root.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { StoreEntity } from "./store.entity";

@Entity({ name: ENTITY_NAME.STORE_MANAGER })
export class StoreManagerEntity extends CreatedByRootEntity {

    @ManyToOne(() => UserEntity, user => user.store)
    user: UserEntity;

    @ManyToOne(() => StoreEntity, store => store.users, { onDelete: "CASCADE" })
    store: StoreEntity;

    @Column({ default: ROLE_STORE.OWNER })
    role: string;

    @Column({ default: STATUS.ACTIVED })
    status: string;
}