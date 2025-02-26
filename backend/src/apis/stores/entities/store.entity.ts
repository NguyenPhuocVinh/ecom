import slugify from "slugify";
import { InventoryEntity } from "src/apis/inventories/entities/inventory.entity";
import { ProductEntity } from "src/apis/products/entities/product.entity";
import { ENTITY_NAME, ROLE_STORE } from "src/common/constants/enum";
import { BaseEntity } from "src/cores/entities/base.entity";
import { BeforeInsert, Column, Entity, OneToMany, OneToOne } from "typeorm";
import { StoreManagerEntity } from "./store-manager.entity";

@Entity({ name: ENTITY_NAME.STORE })
export class StoreEntity extends BaseEntity {
    @Column()
    name: string;

    @Column()
    address: string;

    @Column()
    slug: string;

    @Column()
    phone: string;

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

    @OneToMany(() => ProductEntity, (product) => product.store)
    products: ProductEntity[];

    @OneToMany(() => StoreManagerEntity, (storeManager) => storeManager.store)
    users: StoreManagerEntity[];

    @OneToMany(() => InventoryEntity, (inventory) => inventory.store)
    inventories: InventoryEntity[];

    @BeforeInsert()
    async beforeInsert() {
        this.slug = slugify(this.name, { lower: true });
    }
}
