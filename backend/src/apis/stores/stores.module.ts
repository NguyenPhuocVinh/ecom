import { Module } from '@nestjs/common';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity } from './entities/store.entity';
import { InventoryEntity } from '../inventories/entities/inventory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StoreEntity,
      InventoryEntity
    ])
  ],
  controllers: [StoresController],
  providers: [StoresService]
})
export class StoresModule { }
