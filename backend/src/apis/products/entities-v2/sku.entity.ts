import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, BeforeInsert } from 'typeorm';
import { SpuEntity } from './spu.entity';
import { RootEntity } from 'src/cores/entities/base.entity';
import { FileEntity } from 'src/apis/medias/entities/media.entity';
import { StoreInventoryEntity } from 'src/apis/stores/entities/store-inventory.entity';
import { CartEntity } from 'src/apis/carts/entities/cart.entity';
import { CartItemEntity } from 'src/apis/carts/entities/cart-item.entity';
import { SkuAttributeEntity } from './sku-attribute.entity';

@Entity('skus')
export class SkuEntity extends RootEntity {

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
    cartItems: CartItemEntity[];
}