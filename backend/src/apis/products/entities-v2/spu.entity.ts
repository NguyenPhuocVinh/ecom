import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import { CreatedByRootEntity } from 'src/cores/entities/created-by-root.entity';
import { SkuEntity } from './sku.entity';
import { CategoryEntity } from 'src/apis/categories/entities/category.entity';
import slugify from 'slugify';
import { FileEntity } from 'src/apis/medias/entities/media.entity';

@Entity('spus')
export class SpuEntity extends CreatedByRootEntity {

    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @ManyToOne(() => CategoryEntity, (category) => category.spus)
    category: CategoryEntity;

    @OneToMany(() => SkuEntity, (sku) => sku.spu)
    skus: SkuEntity[];

    @Column({ type: 'varchar', length: 255, nullable: true })
    slug: string;

    @Column({ type: 'int', default: 0 })
    view_count: number;

    @OneToMany(() => FileEntity, (image) => image.spu)
    images: FileEntity[];

    @BeforeInsert()
    async beforeInsert() {
        this.slug = slugify(this.name, { lower: true });
    }

    @BeforeUpdate()
    async beforeUpdate() {
        this.slug = slugify(this.name, { lower: true });
    }
}