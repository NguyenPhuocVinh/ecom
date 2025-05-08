import slugify from "slugify";
import { InventoryEntity } from "src/apis/inventories/entities/inventory.entity";
import { ProductEntity } from "src/apis/products/entities/product-spu.entity";
import { ENTITY_NAME, ROLE_STORE, STORE_STATUS } from "src/common/constants/enum";
import { CreatedByRootEntity } from "src/cores/entities/created-by-root.entity";
import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, Point } from "typeorm";
import { StoreManagerEntity } from "./store-manager.entity";
import { DiscountEntity } from "src/apis/discounts/entities/discounts.entity";
import { StoreInventoryEntity } from "./store-inventory.entity";
// import { CartEntity } from "src/apis/carts/entities/cart.entity";

@Entity({ name: ENTITY_NAME.STORE })
export class StoreEntity extends CreatedByRootEntity {
    @Column()
    name: string;

    @Column()
    address: string;

    @Column()
    slug: string;

    @Column()
    phone: string;

    @Column({ default: '0' })
    longitude: string;

    @Column({ default: '0' })
    latitude: string;

    @Column({ default: ROLE_STORE.OWNER })
    transferPermission: string;

    @Column({ default: ROLE_STORE.OWNER })
    orderPermission: string;

    @Column({ default: ROLE_STORE.OWNER })
    reportPermission: string;

    @Column({ default: ROLE_STORE.OWNER })
    destroyPermission: string;

    @Column({ default: ROLE_STORE.OWNER })
    addUserPermission: string;

    @Column({ default: ROLE_STORE.OWNER })
    removeUserPermission: string;

    @Column({
        enum: STORE_STATUS,
        default: STORE_STATUS.ACTIVED
    })
    status: STORE_STATUS;

    @OneToMany(() => ProductEntity, (product) => product.store, { cascade: true, onDelete: "CASCADE" })
    products: ProductEntity[];

    @OneToMany(() => StoreManagerEntity, (storeManager) => storeManager.store, { cascade: true, onDelete: "CASCADE" })
    users: StoreManagerEntity[];

    @OneToMany(() => StoreInventoryEntity, (inventory) => inventory.store)
    inventories: StoreInventoryEntity[];

    @OneToMany(() => DiscountEntity, (discount) => discount.store, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn()
    discounts: DiscountEntity[];


    @BeforeInsert()
    async beforeInsert() {
        this.slug = slugify(this.name, { lower: true });
    }
}
