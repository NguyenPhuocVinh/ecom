import { TemplateMailEntity } from 'src/apis/mails/entities/template-mails.entity';
import { FileEntity } from 'src/apis/medias/entities/media.entity';
import { RoleEntity } from 'src/apis/roles/entities/roles.entity';
import { TenantEntity } from 'src/apis/tenants/entities/tenants.entity';
import { ENTITY_NAME } from 'src/common/constants/enum';
import { BaseEntity } from 'src/cores/entities/base.entity';
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { OtpEntity } from './otp.entity';

@Entity({ name: ENTITY_NAME.USER })
export class UserEntity extends BaseEntity {
    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    fullName: string;

    @Column({ type: 'date', nullable: true })
    birthdate: Date;

    @OneToMany(() => FileEntity, (file) => file.user)
    cover: FileEntity[];

    @Column({ nullable: true })
    lastLoginVer: string;

    @Column("text", { array: true, default: [] })
    activeLogin: string[];

    @ManyToMany(() => TenantEntity, (tenant) => tenant.user)
    @JoinTable()
    tenants: TenantEntity[];

    @ManyToOne(() => RoleEntity, (role) => role.user)
    role: RoleEntity;

    @OneToMany(() => FileEntity, (file) => file.createdBy)
    files: FileEntity[];

    @OneToMany(() => TemplateMailEntity, (template) => template.createdBy)
    mails: TemplateMailEntity[];

    @OneToOne(() => OtpEntity, (otp) => otp.user)
    otp: OtpEntity;

    @BeforeInsert()
    async beforeInsert() {
        this.fullName = `${this.lastName} ${this.firstName}`;
    }
}
