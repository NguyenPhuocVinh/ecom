function getCurrentTimestampString(): string {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

export async function generateSkuCode(category: string, attribute_value?: string): Promise<string> {
    const prefix = category.toUpperCase();
    const timestamp = getCurrentTimestampString();
    return `${prefix}-${attribute_value}-${timestamp}`;
}
