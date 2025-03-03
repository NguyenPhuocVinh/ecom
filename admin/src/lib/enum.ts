export interface Category {
    id: string;
    name: string;
    longDescription: string;
    shortDescription: string;
    slug: string;
    cover: any;
    parent: Category;
    children: Category[];
    createdBy: any;
    updatedBy: any;
    status: string;
}

export interface Store {
    id: number;
    name: string;
    address: string;
    phone: string;
    slug: string;
    longtiude: string;
    latitude: string;
    transferPermission: string;
    orderPermission: string;
    reportPermission: string;
    destroyPermission: string;
    addUserPermission: string;
    removeUserPermission: string;
    users: any[];
}

export interface SortOption {
    value: string;
    label: string;
}

export interface ParentCategory {
    id: string;
    name: string;
}

export enum ROLE_STORE {
    OWNER = 'owner',
    MANAGER = 'manager',
    ASSISTANT_MANAGER = 'assistant_manager',
}

export interface CreateStoreDto {
    name: string;
    address: string;
    phone: string;
    transferPermission: string;
    orderPermission: string;
    reportPermission: string;
    destroyPermission: string;
    addUserPermission: string;
    removeUserPermission: string;
}

export interface updateStoreDto extends CreateStoreDto { }


export interface VariantDto {
    featuredImages?: string[];
    code: string;
    key: string;
    value: string;
    price: number;
    quantity?: number;
}

export interface AttributeDto {
    code: string;
    key: string;
    value: string;
    variants: VariantDto[];
    featuredImages?: string[];
}

export interface CreateProductDto {
    id?: string;
    name: string;
    categoryId: string;
    longDescription?: string;
    shortDescription?: string;
    featuredImages?: string[];
    stores: string[];
    attributes: AttributeDto[];
}
