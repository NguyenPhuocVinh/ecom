import { StoreEntity } from "src/apis/stores/entities/store.entity";
import { BaseEntity } from "src/cores/entities/base.entity";
import { Entity, OneToMany, OneToOne, JoinColumn, Column } from "typeorm";
import { ENTITY_NAME } from "src/common/constants/enum";
import { ProductEntity } from "src/apis/products/entities/product.entity";

@Entity({ name: ENTITY_NAME.INVENTORY })
export class InventoryEntity extends BaseEntity {
    @OneToOne(() => ProductEntity, (product) => product.inventory)
    product: ProductEntity;

    @Column()
    quantity: number;
}
