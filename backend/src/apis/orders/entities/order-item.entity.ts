import { ENTITY_NAME } from "src/common/constants/enum";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { OrderEntity } from "./order.entity";
import { ProductEntity } from "src/apis/products/entities/product.entity";
import { BaseEntity } from "src/cores/entities/base.entity";


@Entity({ name: ENTITY_NAME.ORDER_ITEM })
export class OrderItemEntity extends BaseEntity {
    @ManyToOne(() => OrderEntity, order => order.items)
    order: OrderEntity;

    @ManyToOne(() => ProductEntity, product => product.id, { onDelete: "CASCADE" })
    @JoinColumn()
    product: ProductEntity;

    @Column({ type: 'jsonb' })
    productOrder: {
        name: string;
        price: number;
        featuredImage: {
            title: string;
            secure_url: string;
            alt: string;
            url: string;
        };
        longDescription?: string;
        shortDescription?: string;
        attribute?: {
            key: string;
            value: string;
            variant?: {
                key: string;
                value: string;
            };
        };
    };
}
