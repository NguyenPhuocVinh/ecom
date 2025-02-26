import { Module } from '@nestjs/common';
import { DiscountsController } from './discounts.controller';
import { DiscountsService } from './discounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountEntity } from './entities/discounts.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DiscountEntity
    ])
  ],
  controllers: [DiscountsController],
  providers: [DiscountsService]
})
export class DiscountsModule { }
