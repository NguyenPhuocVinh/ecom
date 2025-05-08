import { UserEntity } from 'src/apis/users/entities/users.entity';
import { ENTITY_NAME } from 'src/common/constants/enum';
import { CreatedByRootEntity } from 'src/cores/entities/created-by-root.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: ENTITY_NAME.TEMPLATE_MAIL })
export class TemplateMailEntity extends CreatedByRootEntity {
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
