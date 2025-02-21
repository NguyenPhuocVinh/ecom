import { CategoryEntity } from "src/apis/categories/entities/category.entity";
import { ENTITY_NAME } from "src/common/constants/enum";
import { BaseEntity } from "src/cores/entities/base.entity";
import { Entity, ManyToOne } from "typeorm";

@Entity({ name: ENTITY_NAME.PRODUCT })
export class ProductEntity extends BaseEntity {



    @ManyToOne(() => CategoryEntity, (category) => category.products)
    category: CategoryEntity;
}