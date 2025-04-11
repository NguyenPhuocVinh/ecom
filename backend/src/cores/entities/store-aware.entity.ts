import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';
import { RootEntity } from './base.entity';
import { StoreEntity } from 'src/apis/stores/entities/store.entity';

@Entity()
export abstract class StoreAwareEntity extends RootEntity {
    @ManyToOne(() => StoreEntity, { nullable: true })
    @JoinColumn({ name: 'store_id' })
    store: StoreEntity;

    @Column({ name: 'store_id' })
    storeId: string;
}