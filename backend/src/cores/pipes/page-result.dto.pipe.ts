// src/common/pipes/paging-dto.pipe.ts
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { PagingDto } from 'src/common/dto/page-result.dto';
import {
    fullTextSearchConfig,
    searchConfigSelect,
    sortConfig,
    buildConditionOptions,
} from 'src/common/function-helper/search';
import { CONSTANT } from 'src/common/constants/enum';

@Injectable()
export class PagingDtoPipe implements PipeTransform {
    transform(value: PagingDto, metadata: ArgumentMetadata): PagingDto {
        const {
            page = 1,
            limit = 10,
            search,
            select = null,
            sort = '-createdAt',
            search_type = 'and',
            fullTextSearch,
            self_questions,
        } = value;

        const parsedLimit = String(limit) === 'all' ? CONSTANT.ALL : Number(limit);

        const conditions = search ? buildConditionOptions(search) : [];

        const pagingDto: PagingDto = {
            ...value,
            page: Number(page),
            limit: parsedLimit,
            sort: sortConfig(sort),
            search_type,
            filterQuery: conditions,
            select: searchConfigSelect(select),
            fullTextSearch: fullTextSearchConfig(fullTextSearch, Number(page), Number(parsedLimit)),
            self_questions,
        };

        return pagingDto;
    }
}
