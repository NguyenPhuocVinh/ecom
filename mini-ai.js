/*
 *** x : số cây nến ban đầu
 *** y : số lượng sáp nến cần để tạo ra một cây nến mới
 */

function totalCandlesBurned(x, y) {
    if (x <= 0 || y <= 0) {
        return 0;
    }

    if (y === 1) {
        return Infinity;
    }

    let totalBurned = x;
    let stubs = x;
    while (stubs >= y) {
        let newCandles = Math.floor(stubs / y);
        totalBurned += newCandles;
        stubs = newCandles + (stubs % y);
    }

    return totalBurned;
}

function runTests() {
    const testCases = [
        { x: 5, y: 2, expected: 9 }, // Normal case
        { x: 10, y: 3, expected: 14 }, // Normal case
        { x: 4, y: 4, expected: 5 }, // Just enough to make 1 extra candle
        { x: 7, y: 3, expected: 10 }, // Normal case
        { x: 2, y: 3, expected: 2 }, // Not enough stubs to make extra candles
        { x: 100, y: 5, expected: 124 }, // Large number case
        { x: 1000, y: 5, expected: 1249 }, // Large number case
        { x: 0, y: 2, expected: 0 }, // No candles to start
        { x: 10, y: 1, expected: Infinity }, // Infinite candle loop
        { x: 1, y: 2, expected: 1 }, // Only 1 candle, cannot create more
        { x: 50, y: 10, expected: 55 }, // Case with large y
        { x: 9, y: 3, expected: 13 }, // Edge case
        { x: 3, y: 5, expected: 3 }, // Not enough candles to make a new one
        { x: 25, y: 4, expected: 33 }, // Mid-range test
        { x: 8, y: 2, expected: 15 }, // Doubling each time
        { x: -1, y: 2, expected: 0 }, // Negative input
        { x: 2, y: -1, expected: 0 }, // Negative input
        { x: -1, y: -1, expected: 0 }, // Negative input
    ];

    testCases.forEach(({ x, y, expected }, index) => {
        const result = totalCandlesBurned(x, y);
        console.log(
            `Test ${index + 1}: totalCandlesBurned(${x}, ${y}) = ${result} | ${
                result === expected ? "✅ Passed" : "❌ Failed"
            }`
        );
    });
}

// Run all tests
runTests();

/* 
lan 1 dot 5 cay, tao 2 cay moi, 
lan 2 dot 2 cay, tao 1 cay moi,
lan 3 dot 1 cay, tao
*/
