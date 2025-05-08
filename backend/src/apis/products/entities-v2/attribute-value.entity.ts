import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Attribute } from './attribute.entity';
import { SkuAttributeEntity } from './sku-attribute.entity';
import { CreatedByRootEntity } from 'src/cores/entities/created-by-root.entity';

@Entity('attribute_value')
export class AttributeValueEntity extends CreatedByRootEntity {

    @ManyToOne(() => Attribute, (attribute) => attribute.values)
    attribute: Attribute;

    @Column({ type: 'varchar', length: 100, nullable: false })
    value: string;

    @OneToMany(() => SkuAttributeEntity, (skuAttribute) => skuAttribute.attribute_value)
    sku_attributes: SkuAttributeEntity[];

}