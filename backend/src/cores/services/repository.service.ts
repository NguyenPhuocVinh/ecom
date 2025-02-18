// import { Repository, EntityManager, EntityTarget, SelectQueryBuilder, QueryRunner } from 'typeorm';
// import { Injectable } from '@nestjs/common';

// export interface PaginatedResult<T> {
//     data: T[];
//     currentPage: number;
//     pageSize: number;
//     totalDocs: number;
//     totalPages: number;
// }

// @Injectable()
// export class BaseRepositoryService<T> extends Repository<T> {
//     constructor(
//         target: EntityTarget<T>,
//         manager: EntityManager,
//         queryRunner?: QueryRunner,
//     ) {
//         super(target, manager, queryRunner);
//     }

//     async paginate(
//         queryBuilder: SelectQueryBuilder<T>,
//         page: number = 1,
//         pageSize: number = 10
//     ): Promise<PaginatedResult<T>> {
//         const [data, totalDocs] = await queryBuilder
//             .skip((page - 1) * pageSize)
//             .take(pageSize)
//             .getManyAndCount();

//         const totalPages = Math.ceil(totalDocs / pageSize);

//         return {
//             data,
//             currentPage: +page,
//             pageSize: +pageSize,
//             totalDocs,
//             totalPages,
//         };
//     }
// }
import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';

export interface PaginatedResult<T> {
    data: T[];
    currentPage: number;
    pageSize: number;
    totalDocs: number;
    totalPages: number;
}

@Injectable()
export class BaseService<T> {
    constructor(protected readonly repository: Repository<T>) { }

    async paginate(
        queryBuilder: SelectQueryBuilder<T>,
        page: number = 1,
        pageSize: number = 10,
    ): Promise<PaginatedResult<T>> {
        const [data, totalDocs] = await queryBuilder
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getManyAndCount();

        const totalPages = Math.ceil(totalDocs / pageSize);

        return {
            data,
            currentPage: page,
            pageSize,
            totalDocs,
            totalPages,
        };
    }

}
