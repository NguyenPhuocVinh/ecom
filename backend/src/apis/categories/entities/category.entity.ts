import * as _ from "lodash";
import { FileEntity } from "src/apis/medias/entities/media.entity";
import { ProductEntity } from "src/apis/products/entities/product.entity";
import { UserEntity } from "src/apis/users/entities/users.entity";
import { ENTITY_NAME, STATUS } from "src/common/constants/enum";
import { BaseEntity } from "src/cores/entities/base.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";

@Entity({ name: ENTITY_NAME.CATEGORY })
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

    @OneToOne(() => FileEntity, (file) => file.category)
    cover: FileEntity;

    @ManyToOne(() => CategoryEntity, (category) => category.children, { nullable: true })
    parent: CategoryEntity;

    @OneToMany(() => CategoryEntity, (category) => category.parent)
    children: CategoryEntity[];

    @ManyToOne(() => UserEntity, (user) => user.categories)
    createdBy: UserEntity;

    @Column({ default: STATUS.ACTIVED })
    status: string;

    @BeforeInsert()
    async beforeInsert() {
        this.slug = _.kebabCase(this.name);
    }

    @BeforeUpdate()
    async beforeUpdate() {
        this.slug = _.kebabCase(this.name);
    }
}
