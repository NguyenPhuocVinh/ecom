import { FileEntity } from "src/apis/medias/entities/media.entity";
import { UserEntity } from "src/apis/users/entities/users.entity";
import { ENTITY_NAME } from "src/common/constants/enum";
import { BaseEntity } from "src/cores/entities/base.entity";
import { Column, Entity, ManyToOne, OneToOne } from "typeorm";

@Entity({ name: ENTITY_NAME.TENANT })
export class TenantEntity extends BaseEntity {
    @Column()
    name: string;

    @Column({ default: false })
    isRoot: boolean;

    @OneToOne(() => FileEntity, (file) => file.tenantLogo)
    logo: FileEntity;

    @ManyToOne(() => UserEntity, (user) => user.tenants)
    user: UserEntity;
}

