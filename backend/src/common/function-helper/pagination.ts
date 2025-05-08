import { SelectQueryBuilder } from 'typeorm';

export async function paginate<T>(
    qb: SelectQueryBuilder<T>,
    currentPage: number,
    perPage: number
): Promise<{
    data: T[]; meta: {
        currentPage: number;
        perPage: number;
        total: number;
        totalPages: number;
        from: number;
        to: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    }
}> {
    qb.skip((currentPage - 1) * perPage).take(perPage);
    console.log("🚀 ~ qb:", qb.getQueryAndParameters())
    const [data, total] = await qb.getManyAndCount();
    console.log("🚀 ~ total:", total)

    const totalPages = Math.ceil(total / perPage);
    const from = total === 0 ? 0 : (currentPage - 1) * perPage + 1;
    const to = currentPage < totalPages ? currentPage * perPage : total;

    const meta = {
        currentPage,
        perPage,
        total,
        totalPages,
        from,
        to,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
    };

    return { data, meta };
}
