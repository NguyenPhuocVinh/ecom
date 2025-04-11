import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, BeforeInsert } from 'typeorm';
import { RootEntity } from 'src/cores/entities/base.entity';
import { SkuEntity } from './sku.entity';
import { CategoryEntity } from 'src/apis/categories/entities/category.entity';
import slugify from 'slugify';
import { FileEntity } from 'src/apis/medias/entities/media.entity';

@Entity('spus')
export class SpuEntity extends RootEntity {

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
    viewCount: number;

    @OneToMany(() => FileEntity, (image) => image.spu)
    images: FileEntity[];

    @BeforeInsert()
    async beforeInsert() {
        this.slug = slugify(this.name, { lower: true });
    }
}