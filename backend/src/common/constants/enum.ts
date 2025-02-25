export enum ENTITY_NAME {
    USER = 'users',
    FILE = 'files',
    ROLES = 'roles',
    PERMISSIONS = 'permissions',
    CATEGORY = 'categories',
    PRODUCT = 'products',
    ORDER = 'orders',
    ORDER_DETAIL = 'order_details',
    COMMENT = 'comments',
    TENANT = 'tenants',
    CART = 'carts',
    POST = 'posts',
    INVENTORY = 'inventories',
    TEMPLATE_MAIL = 'template_mails',
    OTP = 'otps',
    TOKEN = 'tokens',
    NOTIFICATION = 'notifications',
    PRICE = 'prices',
    STORE = 'stores',
    INVENTORY_ITEM = 'inventory_items',
    STORE_MANAGER = 'store_managers',
    ATTRIBUTE = 'attributes',
    VARIANT = 'variants',
    CART_ITEM = 'cart_items',
}

export enum TYPE_FILE {
    IMAGE = 'image',
    VIDEO = 'video',
    AUDIO = 'audio',
    DOCUMENT = 'document',
}

export enum OPERATOR {
    LIKE = 'LIKE',
    NOT_LIKE = 'NOTLIKE',
    IN = 'IN',
    NOT_IN = 'NOTIN',
    BETWEEN = 'BTW',
    ISNULL = 'ISNULL',
    BEFORE = 'LT',
    IS_AND_BEFORE = 'LTEQ',
    AFTER = 'GT',
    IS_AND_AFTER = 'GTEQ',
    IS = 'IS',
    NOT = 'NOT',
    IS_EMPTY = 'ISEMPTY',
    FULL_TEXT_SEARCH = 'FULL_TEXT_SEARCH',
    GT = 'GT',
    GTEQ = 'GTEQ',
    LT = 'LT',
    LTEQ = 'LTEQ',
    IS_NOT_NULL = 'ISNOTNULL',
    IS_NOT_EMPTY = 'ISNOTEMPTY',
    IS_NOT = 'ISNOT',
    IS_NOT_IN = 'ISNOTIN',
    EQ = 'EQ',
}

export enum CONSTANT {
    LIMIT = 10,
    ALL = 1000000000,
}

export enum STATUS {
    ACTIVED = 'actived',
    DELETED = 'deleted',
}

export enum ROLE_STORE {
    OWNER = 'owner',
    MANAGER = 'manager',
    ASSISTANT_MANAGER = 'assistant_manager',
}

export enum PRODUCT_STATUS {
    DRAFT = 'draft',
    ACTIVED = 'actived',
    DELETED = 'deleted',
}