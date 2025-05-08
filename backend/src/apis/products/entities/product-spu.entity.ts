import slugify from "slugify";
import { CategoryEntity } from "src/apis/categories/entities/category.entity";
import { FileEntity } from "src/apis/medias/entities/media.entity";
import { ENTITY_NAME, PRODUCT_STATUS } from "src/common/constants/enum";
import { CreatedByRootEntity } from "src/cores/entities/created-by-root.entity";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { PriceEntity } from "./price.entity";
import { InventoryEntity } from "src/apis/inventories/entities/inventory.entity";
import { StoreEntity } from "src/apis/stores/entities/store.entity";
import { AttributeEntity } from "./atribute.entity";
import { VariantEntity } from "./variant.entity";
import { OrderItemEntity } from "src/apis/orders/entities/order-item.entity";

@Entity({ name: ENTITY_NAME.PRODUCT })
export class ProductEntity extends CreatedByRootEntity {
    @Column()
    name: string;

    @Column()
    slug: string;

    @Column({ nullable: true })
    longDescription: string;

    @Column({ nullable: true })
    shortDescription: string;

    @Column({ enum: PRODUCT_STATUS, default: PRODUCT_STATUS.ACTIVED })
    status: PRODUCT_STATUS;

    @OneToMany(() => AttributeEntity, (attribute) => attribute.product)
    @JoinColumn()
    attributes: AttributeEntity[];

    @ManyToOne(() => StoreEntity, (store) => store.products)
    @JoinColumn()
    store: StoreEntity;

    @Column({ default: 0 })
    viewCount: number;

    @BeforeInsert()
    async beforeInsert() {
        this.slug = slugify(this.name, { lower: true });
    }
}