import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreEntity } from './entities/store.entity';
import { InventoryEntity } from '../inventories/entities/inventory.entity';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { CreateStoreDto } from './entities/dto/create-store.dto';
import slugify from 'slugify';
import { InjectDataSource } from '@nestjs/typeorm';
import { typeormTransactionHandler } from 'src/common/function-helper/transaction';
import { StoreManagerEntity } from './entities/store-manager.entity';

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

        @InjectDataSource() private readonly dataSource: DataSource,
    ) { }

    async create(createStoreDto: CreateStoreDto, createdBy: any) {
        const { name } = createStoreDto;
        const slug = slugify(name, { lower: true });

        const existStore = await this.storeRepository.findOne({ where: { slug } });
        if (existStore) throw new BadRequestException('STORE_EXIST');

        await typeormTransactionHandler(
            async (manager: EntityManager) => {
                const newStore = this.storeRepository.create({
                    ...createStoreDto,
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

        const result = await this.storeRepository.findOne({ where: { slug } });
        if (!result) throw new BadRequestException('STORE_CREATE_FAIL');
        return result;
    }

    async getDetail(id: string) {
        const store = await this.storeRepository.findOne({ where: { id } });
        if (!store) throw new NotFoundException('STORE_NOT_FOUND');
        const qb = this.storeRepository.createQueryBuilder('store');
        // qb.leftJoinAndSelect('store.managers', 'managers');
        qb.leftJoinAndSelect('store.products', 'products');
        qb.leftJoinAndSelect('products.price', 'price');
        qb.leftJoinAndSelect('products.inventory', 'inventory');
        qb.where('store.id = :id', { id });
        return await qb.getOne();
    }
}
