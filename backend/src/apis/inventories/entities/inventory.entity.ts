import { StoreEntity } from "src/apis/stores/entities/store.entity";
import { BaseEntity } from "src/cores/entities/base.entity";
import { Entity, OneToMany, OneToOne, JoinColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { ENTITY_NAME } from "src/common/constants/enum";
import { ProductEntity } from "src/apis/products/entities/product.entity";
import { AttributeEntity } from "src/apis/products/entities/atribute.entity";
import { VariantEntity } from "src/apis/products/entities/variant.entity";

@Entity({ name: ENTITY_NAME.INVENTORY })
export class InventoryEntity extends BaseEntity {
    @ManyToOne(() => VariantEntity, (variant) => variant.inventories)
    variant: VariantEntity;

    @ManyToOne(() => StoreEntity, (store) => store.inventories)
    store: StoreEntity;

    @Column({ default: 0 })
    quantity: number;
}
