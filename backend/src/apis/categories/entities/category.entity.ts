import * as _ from "lodash";
import slugify from "slugify";
import { FileEntity } from "src/apis/medias/entities/media.entity";
import { ProductEntity } from "src/apis/products/entities/product.entity";
import { UserEntity } from "src/apis/users/entities/users.entity";
import { ENTITY_NAME, STATUS } from "src/common/constants/enum";
import { BaseEntity } from "src/cores/entities/base.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, Tree, TreeChildren, TreeParent } from "typeorm";

@Entity({ name: ENTITY_NAME.CATEGORY })
@Tree("nested-set")
export class CategoryEntity extends BaseEntity {

    @Column()
    name: string;

    @Column({ nullable: true })
    longDescription: string;

    @Column({ nullable: true })
    shortDescription: string;

    @Column({ nullable: true })
    slug: string;

    @OneToMany(() => ProductEntity, (product) => product.category)
    products: ProductEntity[];

    @ManyToOne(() => FileEntity, (file) => file.categories, { nullable: true })
    @JoinColumn()
    cover: FileEntity;

    // Cho phép parent là nullable
    // @ManyToOne(() => CategoryEntity, (category) => category.children, { nullable: true })
    // parent: CategoryEntity;

    // @OneToMany(() => CategoryEntity, (category) => category.parent)
    // children: CategoryEntity[];


    @TreeParent()
    parent: CategoryEntity;

    @TreeChildren()
    children: CategoryEntity[];

    @ManyToOne(() => UserEntity, (user) => user.categories)
    createdBy: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.categories)
    updatedBy: UserEntity;

    @Column({ default: STATUS.ACTIVED })
    status: string;

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
