import { InventoryEntity } from "src/apis/inventories/entities/inventory.entity";
import { FileEntity } from "src/apis/medias/entities/media.entity";
import { ENTITY_NAME } from "src/common/constants/enum";
import { BaseEntity } from "src/cores/entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { ProductEntity } from "./product.entity";
import { PriceEntity } from "./price.entity";
import { AttributeEntity } from "./atribute.entity";

@Entity({ name: ENTITY_NAME.VARIANT })
export class VariantEntity extends BaseEntity {
    @ManyToOne(() => AttributeEntity, attribute => attribute.variants, { onDelete: "CASCADE" })
    attribute: AttributeEntity;

    @Column({ nullable: true })
    code: string;

    @Column({ nullable: true })
    key: string;

    @Column({ nullable: true })
    value: string;

    @OneToMany(() => FileEntity, (file) => file.variant)
    @JoinColumn()
    featuredImages: FileEntity[];

    @OneToMany(() => InventoryEntity, (inventory) => inventory.variant, { onDelete: "CASCADE" })
    inventories: InventoryEntity[];

    @ManyToOne(() => PriceEntity, (price) => price.variants)
    @JoinColumn()
    price: PriceEntity;
}