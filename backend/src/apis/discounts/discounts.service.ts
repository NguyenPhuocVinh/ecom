import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscountEntity } from './entities/discounts.entity';
import { Repository } from 'typeorm';
import { CreateDiscountDto } from './entities/dto/create-discout.dto';
import { PagingDto } from 'src/common/dto/page-result.dto';
import { DISCOUNT_STATUS, OPERATOR } from 'src/common/constants/enum';
import { applyConditionOptions } from 'src/common/function-helper/search';
import { paginate } from 'src/common/function-helper/pagination';
import { UpdateDiscountDto } from './entities/dto/update-discount.dto';

@Injectable()
export class DiscountsService {
    private readonly logger = new Logger(DiscountsService.name);
    constructor(
        @InjectRepository(DiscountEntity)
        private readonly discountRepository: Repository<DiscountEntity>
    ) { }

    async create(data: CreateDiscountDto, req: any) {
        const { code, type } = data;
        const discount = await this.discountRepository.findOne({ where: { code } });
        if (discount) throw new BadRequestException('DISCOUNT_EXISTED');
        const newDiscount = this.discountRepository.create({
            ...data,
        })
        return await this.discountRepository.save(newDiscount);
    }

    async update(id: string, data: UpdateDiscountDto, req: any) {
        const discount = await this.discountRepository.findOne({ where: { id, status: DISCOUNT_STATUS.ACTIVED } });
        if (!discount) throw new BadRequestException('DISCOUNT_NOT_EXISTED');
        return await this.discountRepository.save({
            ...discount,
            ...data,
        });
    }

    async getAllDiscounts(queryParams: PagingDto, req: any) {
        const {
            page,
            limit,
            filterQuery,
            sort,
            fullTextSearch,
        } = queryParams;
        let qb = this.discountRepository.createQueryBuilder('discount')
            .leftJoinAndSelect('discount.store', 'store')
            .leftJoinAndSelect('discount.user', 'user')

        if (filterQuery && Array.isArray(filterQuery)) {
            const hasStatus = filterQuery.some(condition => {
                return condition.key && condition.key.toLowerCase() === 'status';
            });
            if (!hasStatus) {
                filterQuery.push({ key: 'status', operator: OPERATOR.EQ, value: DISCOUNT_STATUS.ACTIVED });
            }
            qb = applyConditionOptions(qb, { and: filterQuery, or: [] }, 'discount');
        } else {
            qb = qb.andWhere('discount.status = :status', { status: DISCOUNT_STATUS.ACTIVED });
        }
        // 🔍 Full-text search theo code và description
        if (fullTextSearch?.searchTerm) {
            qb.andWhere(
                `(discount.code ILIKE :fts OR discount.description ILIKE :fts)`,
                { fts: `%${fullTextSearch.searchTerm}%` }
            );
        }

        if (sort) {
            Object.entries(sort).forEach(([key, order]) => {
                qb.orderBy(`discount.${key}`, order as ("ASC" | "DESC"));
            });
        }

        return await paginate(qb, page, limit);
    }

    async getDiscountDetail(id: string, req: any) {
        const discount = await this.discountRepository.findOne({ where: { id, status: DISCOUNT_STATUS.ACTIVED } });
        if (!discount) throw new BadRequestException('DISCOUNT_NOT_EXISTED');
        return discount;
    }

    async delete(id: string, req: any) {
        const discount = await this.discountRepository.findOne({ where: { id } });
        if (!discount) throw new BadRequestException('DISCOUNT_NOT_EXISTED');
        await this.discountRepository.update({ id }, { status: DISCOUNT_STATUS.DELETED });
        return { message: 'DELETE_DISCOUNT_SUCCESS' };
    }
}
