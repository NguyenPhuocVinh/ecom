import { ENTITY_NAME } from "src/common/constants/enum";
import { CreatedByRootEntity } from "src/cores/entities/created-by-root.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { ProductEntity } from "./product-spu.entity";
import { FileEntity } from "src/apis/medias/entities/media.entity";
import { VariantEntity } from "./variant.entity";

@Entity({ name: ENTITY_NAME.ATTRIBUTE })
export class AttributeEntity extends CreatedByRootEntity {
    @ManyToOne(() => ProductEntity, product => product.attributes, { onDelete: "CASCADE" })
    product: ProductEntity;

    @Column()
    code: string;

    @Column()
    key: string;

    @Column()
    value: string;

    @OneToMany(() => FileEntity, (file) => file.attribute)
    @JoinColumn()
    featuredImages: FileEntity[];

    @OneToMany(() => VariantEntity, (variant) => variant.attribute)
    variants: VariantEntity[];

}