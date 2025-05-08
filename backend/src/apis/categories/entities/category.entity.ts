// src/apis/categories/entities/category.entity.ts
import * as _ from 'lodash';
import slugify from 'slugify';
import { FileEntity } from 'src/apis/medias/entities/media.entity';
import { SpuEntity } from 'src/apis/products/entities-v2/spu.entity';
import { ProductEntity } from 'src/apis/products/entities/product-spu.entity';
import { UserEntity } from 'src/apis/users/entities/users.entity';
import { ENTITY_NAME, STATUS } from 'src/common/constants/enum';
import { CreatedByRootEntity } from 'src/cores/entities/created-by-root.entity';
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';

@Entity({ name: ENTITY_NAME.CATEGORY })
export class CategoryEntity extends CreatedByRootEntity {
    @Column()
    name: string;

    @Column({ nullable: true })
    longDescription: string;

    @Column({ nullable: true })
    shortDescription: string;

    @Column({ nullable: true })
    slug: string;

    @Column({ enum: STATUS, default: STATUS.ACTIVED })
    status: STATUS;

    @ManyToOne(() => FileEntity, { nullable: true })
    @JoinColumn()
    cover: FileEntity;

    // Quan hệ cha-con đơn giản
    @ManyToOne(() => CategoryEntity, (category) => category.children, { nullable: true })
    @JoinColumn({ name: 'parentId' })
    parent: CategoryEntity;

    @OneToMany(() => CategoryEntity, (category) => category.parent)
    children: CategoryEntity[];

    @OneToMany(() => SpuEntity, (spu) => spu.category)
    spus: SpuEntity[];


    @BeforeInsert()
    async beforeInsert() {
        if (this.name) {
            this.slug = slugify(this.name, { lower: true });
        }
    }

    @BeforeUpdate()
    async beforeUpdate() {
        if (this.name) {
            this.slug = slugify(this.name, { lower: true });
        }
    }
}