/** Native BigInt fast doubling. Arithmetic timing excludes decimal serialization. */
export function fibBigInt(n) {
    if (!Number.isSafeInteger(n) || n < 0) {
        throw new RangeError('n must be a non-negative safe integer.');
    }
    const startTime = performance.now();
    let a = 0n, b = 1n;
    const index = BigInt(n);
    if (index !== 0n) {
        for (const bit of (index >> 1n).toString(2)) {
            const c = a * (2n * b - a);
            const d = a * a + b * b;
            [a, b] = bit === '0' ? [c, d] : [d, c + d];
        }
    }
    const value = index === 0n ? 0n : index % 2n === 0n ? a * (2n * b - a) : a * a + b * b;
    return { value, duration: performance.now() - startTime };
}
