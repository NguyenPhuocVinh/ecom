import { ENTITY_NAME } from "src/common/constants/enum";
import { BaseEntity } from "src/cores/entities/base.entity";
import { Column, Entity, OneToOne } from "typeorm";
import { ProductEntity } from "./product.entity";

@Entity({ name: ENTITY_NAME.PRICE })
export class PriceEntity extends BaseEntity {
    @Column()
    rootPrice: string;

    @OneToOne(() => ProductEntity, (product) => product.price)
    product: ProductEntity;
}