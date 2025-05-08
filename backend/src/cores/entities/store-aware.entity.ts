import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';
import { CreatedByRootEntity } from './created-by-root.entity';
import { StoreEntity } from 'src/apis/stores/entities/store.entity';

@Entity()
export abstract class StoreAwareEntity extends CreatedByRootEntity {
    @ManyToOne(() => StoreEntity, { nullable: true })
    @JoinColumn({ name: 'store_id' })
    store: StoreEntity;

    @Column({ name: 'store_id' })
    storeId: string;
}