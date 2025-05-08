import {
    Entity,
    Column,
    ManyToOne,
    PrimaryColumn,
    JoinColumn
} from 'typeorm';
import { StoreEntity } from './store.entity';
import { SkuEntity } from 'src/apis/products/entities-v2/sku.entity';
import { CreatedByRootEntity } from 'src/cores/entities/created-by-root.entity';

@Entity('store_inventory')
export class StoreInventoryEntity extends CreatedByRootEntity {
    @PrimaryColumn()
    store_id: string;

    @PrimaryColumn()
    sku_id: string;

    @ManyToOne(() => StoreEntity, (store) => store.inventories, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'store_id' }) // 👈 map store_id -> store
    store: StoreEntity;

    @ManyToOne(() => SkuEntity, (sku) => sku.inventories, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sku_id' }) // 👈 map sku_id -> sku
    sku: SkuEntity;

    @Column({ type: 'int', nullable: false })
    stock_quantity: number;
}
