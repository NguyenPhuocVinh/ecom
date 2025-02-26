import { ENTITY_NAME } from "src/common/constants/enum";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { OrderEntity } from "./order.entity";
import { ProductEntity } from "src/apis/products/entities/product.entity";
import { BaseEntity } from "src/cores/entities/base.entity";


@Entity({ name: ENTITY_NAME.ORDER_ITEM })
export class OrderItemEntity extends BaseEntity {
    @ManyToOne(() => OrderEntity, order => order.items)
    order: OrderEntity;

    @OneToOne(() => ProductEntity, product => product.id)
    @JoinColumn()
    product: ProductEntity;

    @Column({ type: 'jsonb' })
    productOrder: {
        name: string;
        price: number;
        featuredImage: string;
        longDescription?: string;
        shortDescription?: string;
        attributes?: {
            key: string;
            value: string;
            variant?: {
                key: string;
                value: string;
            };
        }[];
    };
}
