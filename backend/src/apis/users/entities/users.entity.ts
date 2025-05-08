import { TemplateMailEntity } from 'src/apis/mails/entities/template-mails.entity';
import { FileEntity } from 'src/apis/medias/entities/media.entity';
import { RoleEntity } from 'src/apis/roles/entities/roles.entity';
import { ENTITY_NAME } from 'src/common/constants/enum';
import { CreatedByRootEntity } from 'src/cores/entities/created-by-root.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OtpEntity } from './otp.entity';
import { CategoryEntity } from 'src/apis/categories/entities/category.entity';
import { StoreEntity } from 'src/apis/stores/entities/store.entity';
import { StoreManagerEntity } from 'src/apis/stores/entities/store-manager.entity';
import { DiscountEntity } from 'src/apis/discounts/entities/discounts.entity';
import { OrderEntity } from 'src/apis/orders/entities/order.entity';
import { CartEntity } from 'src/apis/carts/entitiesv2/cart.entity';

@Entity({ name: ENTITY_NAME.USER })
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    fullName: string;

    @Column({ type: 'date', nullable: true })
    birthdate: Date;

    @OneToMany(() => FileEntity, (file) => file.user)
    cover: FileEntity[];

    @Column({ nullable: true })
    lastLoginVer: string;

    @Column("text", { array: true, default: [] })
    activeLogin: string[];;

    @Column({ nullable: true })
    refreshToken: string;

    @ManyToOne(() => RoleEntity, (role) => role.user)
    role: RoleEntity;

    @OneToMany(() => FileEntity, (file) => file.created_by)
    files: FileEntity[];

    @OneToMany(() => TemplateMailEntity, (template) => template.created_by)
    mails: TemplateMailEntity[];

    @OneToOne(() => OtpEntity, (otp) => otp.user)
    otp: OtpEntity;

    @OneToMany(() => CategoryEntity, (category) => category.created_by)
    categories: CategoryEntity[];

    @OneToMany(() => StoreManagerEntity, (storeManager) => storeManager.user)
    store: StoreManagerEntity[];

    @OneToOne(() => CartEntity, (cart) => cart.user)
    cart: CartEntity;

    @OneToMany(() => DiscountEntity, (discount) => discount.user)
    @JoinColumn()
    discounts: DiscountEntity[];


    // @OneToMany(() => OrderEntity, order => order.user)
    // orders: OrderEntity[];

    @BeforeInsert()
    async beforeInsert() {
        this.fullName = `${this.lastName} ${this.firstName}`;
    }

    @BeforeUpdate()
    updateTimestamp() {
        this.updated_at = new Date();
    }
    @BeforeInsert()
    setCreatedAt() {
        this.created_at = new Date();
    }

}
