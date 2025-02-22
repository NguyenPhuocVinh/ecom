import { DataSource, EntityManager, QueryRunner } from 'typeorm';

export const typeormTransactionHandler = async <T = any>(
    method: (manager: EntityManager) => Promise<T>,
    onError: (error: any) => any,
    dataSource: DataSource,
    queryRunner?: QueryRunner,
): Promise<T> => {
    let error: any;
    let result: T;

    const isQueryRunnerProvided = queryRunner !== undefined;
    if (!isQueryRunnerProvided) {
        queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
    }

    try {
        result = await method(queryRunner.manager);
        if (!isQueryRunnerProvided) {
            await queryRunner.commitTransaction();
        }
    } catch (err) {
        error = err;
        if (!isQueryRunnerProvided) {
            await queryRunner.rollbackTransaction();
        }
    } finally {
        if (!isQueryRunnerProvided) {
            await queryRunner.release();
        }
        if (error) {
            onError(error);
        }
    }
    return result;
};
