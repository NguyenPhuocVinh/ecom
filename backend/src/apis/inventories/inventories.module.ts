import { Module } from '@nestjs/common';
import { InventoriesController } from './inventories.controller';
import { InventoriesService } from './inventories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryEntity } from './entities/inventory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InventoryEntity,
    ])
  ],
  controllers: [InventoriesController],
  providers: [InventoriesService]
})
export class InventoriesModule { }
