import { Brackets, SelectQueryBuilder, WhereExpressionBuilder } from "typeorm";
import { OPERATOR } from "../constants/enum";
import * as _ from "lodash";
import { UnprocessableEntityException } from "@nestjs/common";
import { diacriticSensitiveRegex } from "./convert-value";

export interface ConditionOption {
    alias?: string;
    key: string;
    operator: string;
    value: any;
}

export function buildConditionOptions(search: Record<string, string>): ConditionOption[] {
    const conditions: ConditionOption[] = [];
    if (typeof search !== 'object' || !search) return conditions;
    Object.entries(search).forEach(([key, value]) => {
        const alias = key.split('.')[0];
        const keyPart = key.split('.')[1];
        const fieldPart = keyPart.split(':')[0];
        let operator = keyPart.split(':')[1].toLowerCase();
        let field = fieldPart;
        let processedValue: any = value;
        if (operator.toLocaleUpperCase() === OPERATOR.BETWEEN) {
            const [from, to] = value.split(',').map(v => v.trim());
            processedValue = { from: new Date(from), to: new Date(to) };
        }
        if (
            operator.toLocaleUpperCase() === OPERATOR.IN ||
            operator.toLocaleUpperCase() === OPERATOR.NOT_IN

        ) {
            processedValue = value.split(',').map(v => v.trim());
        }
        conditions.push({ alias, key: field, operator, value: processedValue });
    });
    return conditions;
}

export function applyConditionOptions<T>(
    qb: SelectQueryBuilder<T>,
    conditions: { and: ConditionOption[]; or: ConditionOption[][] },
    defaultAlias: string
): SelectQueryBuilder<T> {
    // Xử lý điều kiện AND
    if (conditions.and.length > 0) {
        qb.andWhere(new Brackets(qb1 => {
            conditions.and.forEach(cond => {
                addCondition(qb1, cond, defaultAlias, 'andWhere');
            });
        }));
    }

    // Xử lý điều kiện OR
    if (conditions.or.length > 0) {
        qb.andWhere(new Brackets(qb1 => {
            conditions.or.forEach((groupConditions, index) => {
                qb1.orWhere(new Brackets(qb2 => {
                    groupConditions.forEach(cond => {
                        addCondition(qb2, cond, defaultAlias, 'andWhere', index);
                    });
                }));
            });
        }));
    }

    return qb;
}

/**
 * Hàm hỗ trợ thêm điều kiện vào query builder
 * @param qb QueryBuilder hoặc WhereExpressionBuilder
 * @param cond Điều kiện
 * @param defaultAlias Alias mặc định của bảng
 * @param method Kiểu truy vấn (andWhere/orWhere)
 * @param index Chỉ mục nhóm điều kiện (dành cho OR)
 */
function addCondition(
    qb: WhereExpressionBuilder, // ⚠ Fix: Dùng WhereExpressionBuilder thay vì SelectQueryBuilder
    cond: ConditionOption,
    defaultAlias: string,
    method: 'andWhere' | 'orWhere',
    index?: number
) {
    const alias = cond.alias || defaultAlias;
    const paramKey = index !== undefined
        ? `${cond.key.replace(/\./g, '_')}_${index}`
        : cond.key.replace(/\./g, '_');

    switch (cond.operator.toLowerCase()) {
        case OPERATOR.IN.toLowerCase():
        case OPERATOR.NOT_IN.toLowerCase():
        case OPERATOR.IS_NOT_IN.toLowerCase():
            // Với operator IN hoặc NOT_IN, giá trị nên là mảng
            qb.andWhere(`${alias}.${cond.key} ${cond.operator.toLowerCase() === OPERATOR.NOT_IN.toLowerCase() ? 'NOT IN' : 'IN'} (:...${paramKey})`, { [paramKey]: cond.value });
            break;
        case OPERATOR.LIKE.toLowerCase():
        case OPERATOR.NOT_LIKE.toLowerCase():
        case OPERATOR.FULL_TEXT_SEARCH.toLowerCase():
            qb.andWhere(`${alias}.${cond.key} ${cond.operator.toLowerCase() === OPERATOR.NOT_LIKE.toLowerCase() ? 'NOT ILIKE' : 'ILIKE'} :${paramKey}`, { [paramKey]: `%${cond.value}%` });
            break;
        case OPERATOR.BEFORE.toLowerCase():
        case OPERATOR.IS_AND_BEFORE.toLowerCase():
        case OPERATOR.LT.toLowerCase():
        case OPERATOR.LTEQ.toLowerCase():
            qb.andWhere(`${alias}.${cond.key} < :${paramKey}`, { [paramKey]: cond.value });
            break;
        case OPERATOR.AFTER.toLowerCase():
        case OPERATOR.IS_AND_AFTER.toLowerCase():
        case OPERATOR.GT.toLowerCase():
        case OPERATOR.GTEQ.toLowerCase():
            qb.andWhere(`${alias}.${cond.key} > :${paramKey}`, { [paramKey]: cond.value });
            break;
        case OPERATOR.ISNULL.toLowerCase():
        case OPERATOR.IS_NOT_NULL.toLowerCase():
            qb.andWhere(`${alias}.${cond.key} IS ${cond.operator.toLowerCase() === OPERATOR.ISNULL.toLowerCase() ? '' : 'NOT'} NULL`);
            break;
        case OPERATOR.IS_EMPTY.toLowerCase():
        case OPERATOR.IS_NOT_EMPTY.toLowerCase():
            qb.andWhere(`${alias}.${cond.key} ${cond.operator.toLowerCase() === OPERATOR.IS_EMPTY.toLowerCase() ? '=' : '!='} ''`);
            break;
        case OPERATOR.BETWEEN.toLowerCase():
            qb.andWhere(`${alias}.${cond.key} BETWEEN :${paramKey}_from AND :${paramKey}_to`, {
                [`${paramKey}_from`]: cond.value['from'],
                [`${paramKey}_to`]: cond.value['to'],
            });
            break;
        case OPERATOR.IS.toLowerCase():
        case OPERATOR.NOT.toLowerCase():
            qb.andWhere(`${alias}.${cond.key} ${cond.operator.toLowerCase() === OPERATOR.NOT.toLowerCase() ? '!=' : '='} :${paramKey}`, { [paramKey]: cond.value });
            break;
        default:
            qb[method](`${alias}.${cond.key} = :${paramKey}`, { [paramKey]: cond.value });
            break;
    }
}

export function sortConfig(
    sort: string | Record<string, "ASC" | "DESC">
): Record<string, "ASC" | "DESC"> {
    // Nếu sort là object, trả về trực tiếp (hoặc xử lý theo cách khác nếu cần)
    if (typeof sort === "object" && sort !== null) {
        return sort;
    }

    // Nếu sort không phải chuỗi, trả về giá trị mặc định
    if (!sort || typeof sort !== "string") {
        return { createdAt: "DESC" };
    }

    const sortOrder: Record<string, "ASC" | "DESC"> = {};
    // Tách chuỗi theo dấu phẩy (nếu có nhiều trường) 
    // hoặc dấu ":" nếu định dạng sort là "field:ASC" (hoặc "field:DESC")
    const sortFields = sort.split(",");

    sortFields.forEach((field) => {
        const trimmedField = field.trim();
        if (!trimmedField) return;
        // Nếu định dạng là "field:ASC" hoặc "field:DESC"
        if (trimmedField.includes(":")) {
            const [fieldName, order] = trimmedField.split(":");
            sortOrder[fieldName.trim()] = order.trim().toUpperCase() === "DESC" ? "DESC" : "ASC";
        } else {
            // Nếu có dấu '-' ở đầu: ví dụ "-field"
            const isDescending = trimmedField.startsWith("-");
            const cleanField = isDescending ? trimmedField.slice(1) : trimmedField;
            sortOrder[cleanField] = isDescending ? "DESC" : "ASC";
        }
    });

    return sortOrder;
}




export function searchConfigSelect(select: string | string[]): string[] | null {
    if (!select) return null;
    if (Array.isArray(select)) {
        return select;
    }
    return select.split(',').map(s => s.trim());
}

export function fullTextSearchConfig(
    fullTextSearch: any,
    page: number,
    limit: number
): { searchTerm: string; offset: number; limit: number } | null {
    if (!fullTextSearch) return null;
    const { searchTerm } = fullTextSearch;

    return {
        searchTerm: `%${fullTextSearch}%`,
        offset: (page - 1) * limit,
        limit: limit,
    };
}



