// utils.test.js
import { getMillisecondsFromTimestamp } from './app-utils.js';

describe('getMillisecondsFromTimestamp', () => {
    test('converts "01:23.45" to milliseconds', () => {
        expect(getMillisecondsFromTimestamp("01:23.45")).toBe(83450);
    });

    test('converts "00:00.00" to milliseconds', () => {
        expect(getMillisecondsFromTimestamp("00:00.00")).toBe(0);
    });

    test('converts "10:59.99" to milliseconds', () => {
        expect(getMillisecondsFromTimestamp("10:59.99")).toBe(659990);
    });

    test('handles leading zeros correctly', () => {
        expect(getMillisecondsFromTimestamp("05:07.08")).toBe(307080);
    });

    test('handles edge case of "00:59.99"', () => {
        expect(getMillisecondsFromTimestamp("00:59.99")).toBe(59990);
    });
});

