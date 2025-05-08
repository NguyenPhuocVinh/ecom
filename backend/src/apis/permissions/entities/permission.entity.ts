// import { FileEntity } from 'src/apis/medias/entities/media.entity';
import { RoleEntity } from 'src/apis/roles/entities/roles.entity';
import { ENTITY_NAME } from 'src/common/constants/enum';
import { CreatedByRootEntity } from 'src/cores/entities/created-by-root.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: ENTITY_NAME.PERMISSIONS })
export class PermissionEntity extends CreatedByRootEntity {
    @Column()
    name: string;

    @Column()
    entityName: string;

    @ManyToMany(() => RoleEntity, (role) => role.permissions)
    role: RoleEntity[];
}
