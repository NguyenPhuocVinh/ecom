import slugify from "slugify";
import { CategoryEntity } from "src/apis/categories/entities/category.entity";
import { FileEntity } from "src/apis/medias/entities/media.entity";
import { ENTITY_NAME, PRODUCT_STATUS } from "src/common/constants/enum";
import { BaseEntity } from "src/cores/entities/base.entity";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { PriceEntity } from "./price.entity";
import { InventoryEntity } from "src/apis/inventories/entities/inventory.entity";
import { StoreEntity } from "src/apis/stores/entities/store.entity";
import { AttributeEntity } from "./atribute.entity";
import { VariantEntity } from "./variant.entity";
import { CartItemEntity } from "src/apis/carts/entities/cart-item.entity";
import { OrderItemEntity } from "src/apis/orders/entities/order-item.entity";

@Entity({ name: ENTITY_NAME.PRODUCT })
export class ProductEntity extends BaseEntity {
    @Column()
    name: string;

    @Column()
    slug: string;

    @ManyToOne(() => CategoryEntity, (category) => category.products, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "categoryId" })
    category: CategoryEntity;

    @Column({ nullable: true })
    longDescription: string;

    @Column({ nullable: true })
    shortDescription: string;

    @Column({ enum: PRODUCT_STATUS, default: PRODUCT_STATUS.ACTIVED })
    status: PRODUCT_STATUS;

    @OneToMany(() => FileEntity, (file) => file.product, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn()
    featuredImages: FileEntity[];


    @OneToOne(() => PriceEntity, (price) => price.product)
    @JoinColumn()
    price: PriceEntity;

    @OneToMany(() => AttributeEntity, (attribute) => attribute.product)
    @JoinColumn()
    attributes: AttributeEntity[];

    @ManyToOne(() => StoreEntity, (store) => store.products)
    @JoinColumn()
    store: StoreEntity;

    @OneToMany(() => CartItemEntity, (item) => item.product)
    cartItem: CartItemEntity;

    @Column({ default: 0 })
    viewCount: number;

    @BeforeInsert()
    async beforeInsert() {
        this.slug = slugify(this.name, { lower: true });
    }
}