import slugify from "slugify";
import { InventoryEntity } from "src/apis/inventories/entities/inventory.entity";
import { ProductEntity } from "src/apis/products/entities/product.entity";
import { ENTITY_NAME, ROLE_STORE } from "src/common/constants/enum";
import { BaseEntity } from "src/cores/entities/base.entity";
import { BeforeInsert, Column, Entity, OneToMany, OneToOne } from "typeorm";

class Manager {
    user: string; // Lưu ID dưới dạng string
    role: string;
}

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

    @Column({ type: 'json', nullable: true })
    managers: Manager[];

    @Column({ default: ROLE_STORE.OWNER })
    transferPermission: string;

    @Column({ default: ROLE_STORE.OWNER })
    orderPermission: string;

    @Column({ default: ROLE_STORE.OWNER })
    reportPermission: string;

    @Column({ default: ROLE_STORE.OWNER })
    destroyPermission: string;

    @OneToMany(() => ProductEntity, (product) => product.store)
    products: ProductEntity[];

    @BeforeInsert()
    async beforeInsert() {
        this.slug = slugify(this.name, { lower: true });
    }
}
