import { UserEntity } from 'src/apis/users/entities/users.entity';
import { ENTITY_NAME } from 'src/common/constants/enum';
import { RootEntity } from 'src/cores/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: ENTITY_NAME.TEMPLATE_MAIL })
export class TemplateMailEntity extends RootEntity {
    @Column()
    name: string;

    @Column()
    subject: string;

    @Column({ type: 'text' })
    body: string;

    @Column({ type: 'text', nullable: true })
    plainTextBody: string;

    @Column({ type: 'json', nullable: true })
    variables: Record<string, any>;

    @Column({ nullable: true })
    description: string;

    @Column({ default: false })
    isActive: boolean;

    @Column({ nullable: true })
    language: string;

    @Column({ nullable: true })
    tags: string;
}
