// utils.test.js
import { getMillisecondsFromTimestamp, getSRTFormatedTimestamp } from './app-utils.js';

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


describe('getSRTFormatedTimestamp', () => {
    test('converts 0 milliseconds correctly', () => {
        expect(getSRTFormatedTimestamp(0)).toBe('00:00:00,000');
    });

    test('converts milliseconds less than a second correctly', () => {
        expect(getSRTFormatedTimestamp(123)).toBe('00:00:00,123');
    });

    test('converts milliseconds to seconds correctly', () => {
        expect(getSRTFormatedTimestamp(5000)).toBe('00:00:05,000');
    });

    test('converts milliseconds to minutes and seconds correctly', () => {
        expect(getSRTFormatedTimestamp(65000)).toBe('00:01:05,000');
    });

    test('converts milliseconds with remaining milliseconds correctly', () => {
        expect(getSRTFormatedTimestamp(61023)).toBe('00:01:01,023');
    });

    test('converts milliseconds with leading zeros correctly', () => {
        expect(getSRTFormatedTimestamp(300)).toBe('00:00:00,300');
        expect(getSRTFormatedTimestamp(100)).toBe('00:00:00,100');
        expect(getSRTFormatedTimestamp(10)).toBe('00:00:00,010');
        expect(getSRTFormatedTimestamp(1)).toBe('00:00:00,001');
    });

    test('handles negative milliseconds by treating as zero', () => {
        expect(getSRTFormatedTimestamp(-1000)).toBe('00:00:00,000');
    });

});
