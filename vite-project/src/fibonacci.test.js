import { test } from 'node:test';
import assert from 'node:assert/strict';
import BN from 'bn.js';
import { fib, fibBigInt } from './fibonacci.js';

test('fast doubling matches recurrence and the retained BN matrix API', () => {
    let a = 0n, b = 1n;
    for (let n = 0; n <= 4097; n++) {
        assert.equal(fibBigInt(n).value, a, `F(${n})`);
        [a, b] = [b, a + b];
    }
    for (const n of [0, 1, 2, 100_000, 100_001]) {
        const legacy = fib(n);
        assert(BN.isBN(legacy.value));
        assert.equal(fibBigInt(n).value.toString(16), legacy.value.toString(16));
    }
});

test('invalid indices fail instead of being rounded or truncated', () => {
    for (const n of [-1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1, '100', 100n]) {
        assert.throws(() => fibBigInt(n), /non-negative safe integer/);
    }
});
