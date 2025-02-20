import { TenantEntity } from "src/apis/tenants/entities/tenants.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

}
