import { STATUS } from "src/common/constants/enum";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export class RootEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ nullable: true })
    createdBy: string | null;

    @Column({ nullable: true })
    updatedBy: string | null;
}
