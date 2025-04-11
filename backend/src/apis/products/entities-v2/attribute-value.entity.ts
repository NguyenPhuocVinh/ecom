import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Attribute } from './attribute.entity';
import { SkuAttributeEntity } from './sku-attribute.entity';
import { RootEntity } from 'src/cores/entities/base.entity';

@Entity('attribute_value')
export class AttributeValueEntity extends RootEntity {

    @ManyToOne(() => Attribute, (attribute) => attribute.values)
    attribute: Attribute;

    @Column({ type: 'varchar', length: 100, nullable: false })
    value: string;

    @OneToMany(() => SkuAttributeEntity, (skuAttribute) => skuAttribute.attribute_value)
    skuAttributes: SkuAttributeEntity[];

}