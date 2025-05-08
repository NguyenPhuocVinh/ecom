import { FileEntity } from 'src/apis/medias/entities/media.entity';
import { PermissionEntity } from 'src/apis/permissions/entities/permission.entity';
import { UserEntity } from 'src/apis/users/entities/users.entity';
import { ENTITY_NAME } from 'src/common/constants/enum';
import { CreatedByRootEntity } from 'src/cores/entities/created-by-root.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity({ name: ENTITY_NAME.ROLES })
export class RoleEntity extends CreatedByRootEntity {
    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToMany(() => PermissionEntity, (permission) => permission.role)
    @JoinTable()
    permissions: PermissionEntity[];

    @OneToMany(() => UserEntity, (user) => user.role)
    user: UserEntity[];

    @Column({ default: false })
    isDefault: boolean;
}
