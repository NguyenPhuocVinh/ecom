import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { AttributeValueEntity } from './attribute-value.entity';
import { CreatedByRootEntity } from 'src/cores/entities/created-by-root.entity';
import { SkuAttributeEntity } from './sku-attribute.entity';


@Entity('attribute')
export class Attribute extends CreatedByRootEntity {
    @Column({ type: 'varchar', length: 100, nullable: false })
    name: string;

    @OneToMany(() => AttributeValueEntity, (attributeValue) => attributeValue.attribute)
    values: AttributeValueEntity[];

    @OneToMany(() => SkuAttributeEntity, (skuAttribute) => skuAttribute.attribute)
    sku_attributes: SkuAttributeEntity[];

}