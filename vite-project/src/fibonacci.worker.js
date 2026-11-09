import { fibBigInt } from './fibonacci-bigint.js';
self.onmessage = ({ data: { n, radix } }) => {
    try {
        if (radix !== 10 && radix !== 16) throw new RangeError('Choose decimal or hexadecimal output.');
        const { value, duration } = fibBigInt(n);
        const start = performance.now();
        const text = value.toString(radix);
        self.postMessage({ text, duration, serializationMs: performance.now() - start });
    } catch (error) {
        self.postMessage({ error: error instanceof Error ? error.message : String(error) });
    }
};
