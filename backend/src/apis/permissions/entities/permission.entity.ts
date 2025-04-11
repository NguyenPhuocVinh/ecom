// import { FileEntity } from 'src/apis/medias/entities/media.entity';
import { RoleEntity } from 'src/apis/roles/entities/roles.entity';
import { ENTITY_NAME } from 'src/common/constants/enum';
import { RootEntity } from 'src/cores/entities/base.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: ENTITY_NAME.PERMISSIONS })
export class PermissionEntity extends RootEntity {
    @Column()
    name: string;

    @Column()
    entityName: string;

    @ManyToMany(() => RoleEntity, (role) => role.permissions)
    role: RoleEntity[];
}
