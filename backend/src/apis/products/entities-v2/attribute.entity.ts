import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { AttributeValueEntity } from './attribute-value.entity';
import { RootEntity } from 'src/cores/entities/base.entity';
import { SkuAttributeEntity } from './sku-attribute.entity';


@Entity('attribute')
export class Attribute extends RootEntity {
    @Column({ type: 'varchar', length: 100, nullable: false })
    name: string;

    @OneToMany(() => AttributeValueEntity, (attributeValue) => attributeValue.attribute)
    values: AttributeValueEntity[];

    @OneToMany(() => SkuAttributeEntity, (skuAttribute) => skuAttribute.attribute)
    skuAttributes: SkuAttributeEntity[];

}