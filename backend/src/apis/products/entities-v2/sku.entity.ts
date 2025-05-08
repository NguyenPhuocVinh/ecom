import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, BeforeInsert } from 'typeorm';
import { SpuEntity } from './spu.entity';
import { FileEntity } from 'src/apis/medias/entities/media.entity';
import { StoreInventoryEntity } from 'src/apis/stores/entities/store-inventory.entity';
import { SkuAttributeEntity } from './sku-attribute.entity';
import { CreatedByRootEntity } from 'src/cores/entities/created-by-root.entity';
import { CartItemEntity } from 'src/apis/carts/entitiesv2/cart-item.entity';

@Entity('skus')
export class SkuEntity extends CreatedByRootEntity {

    @ManyToOne(() => SpuEntity, (spu) => spu.skus)
    spu: SpuEntity;

    @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
    sku_code: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    price: number;

    @OneToMany(() => SkuAttributeEntity, (skuAttribute) => skuAttribute.sku)
    attributes: SkuAttributeEntity[];

    @OneToMany(() => FileEntity, (image) => image.sku)
    images: FileEntity[];

    @OneToMany(() => StoreInventoryEntity, (inventory) => inventory.sku)
    inventories: StoreInventoryEntity[];

    @OneToMany(() => CartItemEntity, (cartItem) => cartItem.sku)
    cart_items: CartItemEntity[];
}