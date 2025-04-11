import * as _ from 'lodash';
import slugify from 'slugify';
import { CategoryEntity } from 'src/apis/categories/entities/category.entity';
import { SkuEntity } from 'src/apis/products/entities-v2/sku.entity';
import { SpuEntity } from 'src/apis/products/entities-v2/spu.entity';
import { AttributeEntity } from 'src/apis/products/entities/atribute.entity';
import { ProductEntity } from 'src/apis/products/entities/product-spu.entity';
import { VariantEntity } from 'src/apis/products/entities/variant.entity';
import { UserEntity } from 'src/apis/users/entities/users.entity';
import { ENTITY_NAME } from 'src/common/constants/enum';
import { RootEntity } from 'src/cores/entities/base.entity';
import { BeforeInsert, Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';

@Entity({ name: ENTITY_NAME.FILE })
export class FileEntity extends RootEntity {
    @Column()
    title: string;

    @Column({ nullable: true })
    alt: string;

    @Column({ nullable: true })
    asset_id: string;

    @Column({ nullable: true })
    public_id: string;

    @Column({ nullable: true })
    version: number;

    @Column({ nullable: true })
    version_id: string;

    @Column({ nullable: true })
    signature: string;

    @Column({ nullable: true })
    width: number;

    @Column({ nullable: true })
    height: number;

    @Column({ nullable: true })
    format: string;

    @Column({ nullable: true })
    resource_type: string;

    @Column("text", { array: true, default: [] })
    tags: string[];

    @Column({ nullable: true })
    bytes: number;

    @Column({ nullable: true })
    type: string;

    @Column({ nullable: true })
    etag: string;

    @Column({ nullable: true })
    placeholder: boolean;

    @Column({ nullable: true })
    url: string;

    @Column({ nullable: true })
    secure_url: string;

    @Column({ nullable: true })
    display_name: string;

    @Column({ nullable: true })
    original_filename: string;

    @ManyToOne(() => UserEntity, (user) => user.cover, { nullable: true })
    user: UserEntity;

    @OneToMany(() => CategoryEntity, (category) => category.cover, { nullable: true })
    categories: CategoryEntity;

    @ManyToOne(() => AttributeEntity, (attribute) => attribute.featuredImages, { nullable: true, onDelete: 'SET NULL' })
    attribute: AttributeEntity;

    @ManyToOne(() => VariantEntity, (variant) => variant.featuredImages, { nullable: true, onDelete: 'SET NULL' })
    variant: VariantEntity;

    @ManyToOne(() => SpuEntity, (spu) => spu.images, { nullable: true })
    spu: SpuEntity;

    @ManyToOne(() => SkuEntity, (sku) => sku.images, { nullable: true })
    sku: SkuEntity;
    @BeforeInsert()
    async generateAlt() {
        if (!this.alt) {
            this.alt = slugify(this.title, { lower: true });
        }
    }
}
