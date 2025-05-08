import { ENTITY_NAME } from "src/common/constants/enum";
import { CreatedByRootEntity } from "src/cores/entities/created-by-root.entity";
import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import { ProductEntity } from "./product-spu.entity";
import { AttributeEntity } from "./atribute.entity";
import { VariantEntity } from "./variant.entity";

@Entity({ name: ENTITY_NAME.PRICE })
export class PriceEntity extends CreatedByRootEntity {
    @Column()
    rootPrice: number;

    @OneToMany(() => VariantEntity, (variant) => variant.price, { onDelete: "CASCADE" })
    variants: VariantEntity[];
}