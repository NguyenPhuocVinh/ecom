function generateSpuId(category: string, color: string, count: number): string {
    const prefix = category.toUpperCase();       // Ví dụ: TSHIRT
    const colorCode = color.toUpperCase();       // RED
    const padded = count.toString().padStart(3, '0'); // 001
    return `${prefix}-${colorCode}-${padded}`;   // TSHIRT-RED-001
}
