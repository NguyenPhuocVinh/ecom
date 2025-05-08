import { StoreEntity } from "src/apis/stores/entities/store.entity";
import { CreatedByRootEntity } from "src/cores/entities/created-by-root.entity";
import { Entity, OneToMany, OneToOne, JoinColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { ENTITY_NAME } from "src/common/constants/enum";
import { ProductEntity } from "src/apis/products/entities/product-spu.entity";
import { AttributeEntity } from "src/apis/products/entities/atribute.entity";
import { VariantEntity } from "src/apis/products/entities/variant.entity";

@Entity({ name: ENTITY_NAME.INVENTORY })
export class InventoryEntity extends CreatedByRootEntity {
    @ManyToOne(() => VariantEntity, (variant) => variant.inventories, { onDelete: "CASCADE" })
    variant: VariantEntity;

    @ManyToOne(() => StoreEntity, (store) => store.inventories, { onDelete: "CASCADE" })
    store: StoreEntity;

    @Column({ default: 0 })
    quantity: number;
}
