import { getMillisecondsFromTimestamp, getSRTFormatedTimestamp, addLinebreaksIfNeeded } from './app-utils.js';

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


describe('addLinebreaksIfNeeded', () => {
    test('returns the same string if it is shorter than or equal to maxCharacters', () => {
        const result = addLinebreaksIfNeeded('This is a short string.', 43);
        expect(result).toBe('This is a short string.');
    });

    test('adds line breaks at commas if the string is between maxCharacters and maxCharacters * 2', () => {
        const result = addLinebreaksIfNeeded('This is a longer string, with commas, that should be split.', 43);
        expect(result).toBe('This is a longer string,\nwith commas, that should be split.');
    });

    test('adds line breaks at spaces if the string is between maxCharacters and maxCharacters * 2 and has no commas', () => {
        const result = addLinebreaksIfNeeded('This is a longer string without commas that should be split.', 43);
        expect(result).toBe('This is a longer string without\ncommas that should be split.');
    });

    test('uses default maxCharacters (43) if not provided', () => {
        const result = addLinebreaksIfNeeded('This is a longer string, with commas, that should be split.');
        expect(result).toBe('This is a longer string,\nwith commas, that should be split.');
    });

    test('handles empty string correctly', () => {
        const result = addLinebreaksIfNeeded('', 43);
        expect(result).toBe('');
    });

    test('handles strings with no spaces or commas correctly', () => {
        const result = addLinebreaksIfNeeded('ThisIsAStringWithNoSpacesOrCommas', 43);
        expect(result).toBe('ThisIsAStringWithNoSpacesOrCommas');
    });

    test('handles strings exactly maxCharacters long', () => {
        const exactLengthString = 'a'.repeat(43);
        const result = addLinebreaksIfNeeded(exactLengthString, 43);
        expect(result).toBe(exactLengthString);
    });

    test('adds line breaks at commas if the string is between custom maxCharacters and maxCharacters * 2', () => {
        const result = addLinebreaksIfNeeded('This is a longer string, with commas, that should be split.', 30);
        expect(result).toBe('This is a longer string,\nwith commas, that\nshould be split.');
    });


    test('does not add line breaks if the string is shorter than custom maxCharacters', () => {
        const shortString = 'This is a short string.';
        const result = addLinebreaksIfNeeded(shortString, 30);
        expect(result).toBe(shortString);
    });

    test('adds line breaks at spaces if the string is between custom maxCharacters and maxCharacters * 2 and has no commas', () => {
        const result = addLinebreaksIfNeeded('This is a longer string without commas that should be split', 30);
        expect(result).toBe('This is a longer string\nwithout commas that\nshould be split');
    });

    test('adds line breaks at word if the space is after maxCharacters', () => {
        const result = addLinebreaksIfNeeded('ThisIsALongWord with a Space afterwards', 10);
        expect(result).toBe('ThisIsALo-\nngWord\nwith a\nSpace\nafterwards');
    });

});
