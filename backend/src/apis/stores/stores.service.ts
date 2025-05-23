import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreEntity } from './entities/store.entity';
import { InventoryEntity } from '../inventories/entities/inventory.entity';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { CreateStoreDto } from './entities/dto/create-store.dto';
import slugify from 'slugify';
import { InjectDataSource } from '@nestjs/typeorm';
import { typeormTransactionHandler } from 'src/common/function-helper/transaction';
import { StoreManagerEntity } from './entities/store-manager.entity';
import { ProductEntity } from '../products/entities/product-spu.entity';
import { PagingDto } from 'src/common/dto/page-result.dto';
import { OPERATOR, PRODUCT_STATUS, STATUS } from 'src/common/constants/enum';
import { applyConditionOptions } from 'src/common/function-helper/search';
import { paginate } from 'src/common/function-helper/pagination';
import { AddUserToStoreDto } from './entities/dto/add-user-to-store.dto';
import { DiscountEntity } from '../discounts/entities/discounts.entity';

@Injectable()
export class StoresService {
    private readonly logger = new Logger(StoresService.name);

    constructor(
        @InjectRepository(StoreEntity)
        private readonly storeRepository: Repository<StoreEntity>,

        @InjectRepository(InventoryEntity)
        private readonly inventoryRepository: Repository<InventoryEntity>,

        @InjectRepository(StoreManagerEntity)
        private readonly storeManagerRepository: Repository<StoreManagerEntity>,

        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,

        @InjectRepository(DiscountEntity)
        private readonly discountRepository: Repository<DiscountEntity>,

        @InjectDataSource() private readonly dataSource: DataSource,
    ) { }

    async create(createStoreDto: CreateStoreDto, createdBy: any) {
        const { name, lat, lon } = createStoreDto;
        const slug = slugify(name, { lower: true });

        const existStore = await this.storeRepository.findOne({ where: { slug } });
        if (existStore) throw new BadRequestException('STORE_EXIST');

        await typeormTransactionHandler(
            async (manager: EntityManager) => {
                const newStore = this.storeRepository.create({
                    ...createStoreDto,
                    latitude: lat,
                    longitude: lon,
                    slug,
                });
                await manager.save(StoreEntity, newStore);

                const managerStore = this.storeManagerRepository.create({
                    user: createdBy,
                    store: newStore,
                });
                await manager.save(StoreManagerEntity, managerStore);
            },
            (error) => {
                throw error;
            },
            this.dataSource
        );

        const data = await this.storeRepository.findOne({ where: { slug } });
        if (!data) throw new BadRequestException('STORE_CREATE_FAIL');
        return { data };
    }

    async getDetail(id: string) {
        const store = await this.storeRepository.findOne({ where: { id } });
        if (!store) throw new NotFoundException('STORE_NOT_FOUND');
        const qb = this.storeRepository.createQueryBuilder('store');
        // qb.leftJoinAndSelect('store.managers', 'managers');
        qb.leftJoinAndSelect('store.products', 'products');
        qb.leftJoinAndSelect('products.price', 'price');
        qb.where('store.id = :id', { id });
        const data = await qb.getOne();
        return { data }
    }

    async getProductStore(id: string, queryParams: PagingDto, req: any) {
        const {
            filterQuery,
            fullTextSearch,
            sort,
            page,
            limit
        } = queryParams;

        const store = await this.storeRepository.findOne({ where: { id } });
        if (!store) throw new NotFoundException('STORE_NOT_FOUND');
        let qb = this.productRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.store', 'store')
            .leftJoinAndSelect('store.users', 'users')
            .leftJoin('users.user', 'user')
            .addSelect(['user.email', 'user.firstName', 'user.lastName', 'user.fullName'])
            .leftJoinAndSelect('product.featuredImages', 'featuredImages')
            .leftJoinAndSelect('product.attributes', 'attributes')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('attributes.variants', 'variants')
            .leftJoinAndSelect('variants.inventory', 'inventory')
            .leftJoinAndSelect('variants.price', 'price');

        if (filterQuery && Array.isArray(filterQuery)) {
            const hasStatus = filterQuery.some(condition => {
                return condition.key && condition.key.toLowerCase() === 'status';
            });
            if (!hasStatus) {
                filterQuery.push({ key: 'status', operator: OPERATOR.EQ, value: PRODUCT_STATUS.ACTIVED });
            }
            qb = applyConditionOptions(qb, { and: filterQuery, or: [] }, 'product');
        } else {
            qb = qb.andWhere('product.status = :status', { status: PRODUCT_STATUS.ACTIVED });
        }

        if (fullTextSearch && fullTextSearch.searchTerm) {
            console.log("🚀 ~ StoresService ~ getProductStore ~ searchTerm:", fullTextSearch.searchTerm)
            qb.andWhere(
                `(product.name ILIKE :fts OR product.longDescription ILIKE :fts OR product.shortDescription ILIKE :fts)`,
                { fts: `%${fullTextSearch.searchTerm}%` }
            );
        }

        if (sort) {
            Object.entries(sort).forEach(([key, order]) => {
                qb.orderBy(`product.${key}`, order as ("ASC" | "DESC"));
            });
        }

        return await paginate(qb, page, limit);
    }

    async getUserStore(id: string, queryParams: PagingDto, req: any) {
        const store = await this.storeRepository.findOne({ where: { id } });
        if (!store) throw new NotFoundException('STORE_NOT_FOUND');
        const users = await this.storeManagerRepository.find({
            where: { store: { id } },
            relations: ['user'],
        })
        return users;
    }

    async addUserToStore(
        id: string,
        data: AddUserToStoreDto,
        req: any
    ) {
        const { userId, role } = data;
        const store = await this.storeRepository
            .createQueryBuilder('store')
            .leftJoinAndSelect('store.users', 'users')
            .leftJoin('users.user', 'user')
            .addSelect(['user.email', 'user.firstName', 'user.lastName', 'user.fullName', 'user.id'])
            .where('store.id = :id', { id })
            .getOne();

        if (!store) throw new NotFoundException('STORE_NOT_FOUND');

        const found = store.users.find((u) => u.user.id === req.user.id);
        if (!found) throw new ForbiddenException('USER_NOT_ALLOW');
        const allowedRoles = store.addUserPermission
            .split(',')
            .map(role => role.trim().toLowerCase());
        if (!allowedRoles.includes(found.role.toLowerCase())) {
            throw new ForbiddenException('USER_NOT_ALLOW');
        }
        const addUser = this.storeManagerRepository.create({
            store,
            user: { id: userId },
            role,
        })
        await this.storeManagerRepository.save(addUser);
        return this.getUserStore(id, null, req);
    }

    async getDiscountStore(id: string, queryParams: PagingDto, req: any) {
        const store = await this.storeRepository.findOne({ where: { id } });
        if (!store) throw new NotFoundException('STORE_NOT_FOUND');
        const discounts = await this.discountRepository.find({
            where: { store: { id } },
            relations: ['user'],
        });
        return discounts;
    }

    async getAllStores(queryParams: PagingDto, req: any) {
        const {
            filterQuery,
            fullTextSearch,
            sort,
            page,
            limit
        } = queryParams;
        let qb = this.storeRepository.createQueryBuilder('store');
        if (filterQuery && Array.isArray(filterQuery)) {
            qb.where('store.status = :status', { status: STATUS.ACTIVED });
            qb = applyConditionOptions(qb, { and: filterQuery, or: [] }, 'store');
        } else {
            qb.where('store.status = :status', { status: STATUS.ACTIVED });
        }
        if (sort) {
            Object.entries(sort).forEach(([key, order]) => {
                qb.orderBy(`store.${key}`, order as ("ASC" | "DESC"));
            });
        }
        return await paginate(qb, page, limit);
    }

    async getStoreNearest(lat: number, lon: number) {
        const stores = await this.storeRepository.find();
        const nearestStore = stores.reduce((prev, curr) => {
            const prevDistance = Math.sqrt(
                Math.pow(Number(prev.latitude) - lat, 2) + Math.pow(Number(prev.longitude) - lon, 2)
            );
            const currDistance = Math.sqrt(
                Math.pow(Number(curr.latitude) - lat, 2) + Math.pow(Number(curr.longitude) - lon, 2)
            );
            return prevDistance < currDistance ? prev : curr;
        });
        return nearestStore;
    }

    async updateStore(id: string, data: any, req: any) {
        const { name } = data;
        const store = await this.storeRepository.findOne({ where: { id } });
        const slug = slugify(name, { lower: true });
        if (!store) throw new NotFoundException('STORE_NOT_FOUND');
        await this.storeRepository.update({ id }, { ...data });
        return await this.storeRepository.findOne({ where: { id } });
    }

    async deleteStore(storeId: string, req: any) {
        const store = await this.storeRepository.findOne({
            where: { id: storeId },
            relations: ["products", "users", "inventories", "discounts"],
        });

        if (!store) {
            throw new Error("Store not found");
        }

        await this.storeRepository.remove(store);
    }

}
