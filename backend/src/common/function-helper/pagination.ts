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
    // Áp dụng phân trang trên query builder
    qb.skip((currentPage - 1) * perPage).take(perPage);

    // Lấy data và tổng số bản ghi từ cơ sở dữ liệu
    const [data, total] = await qb.getManyAndCount();

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
