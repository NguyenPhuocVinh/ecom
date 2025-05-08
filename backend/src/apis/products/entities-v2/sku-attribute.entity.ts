import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { SkuEntity } from './sku.entity';
import { Attribute } from './attribute.entity';
import { AttributeValueEntity } from './attribute-value.entity';

@Entity('sku_attribute')
export class SkuAttributeEntity {
    @PrimaryColumn()
    sku_id: string;

    @PrimaryColumn()
    attribute_id: string;

    @PrimaryColumn()
    attribute_value_id: string;

    @ManyToOne(() => SkuEntity, (sku) => sku.attributes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sku_id' })
    sku: SkuEntity;

    @ManyToOne(() => Attribute, (attribute) => attribute.sku_attributes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'attribute_id' })
    attribute: Attribute;

    @ManyToOne(() => AttributeValueEntity, (attributeValue) => attributeValue.sku_attributes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'attribute_value_id' })
    attribute_value: AttributeValueEntity;
}
