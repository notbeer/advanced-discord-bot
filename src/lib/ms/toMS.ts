/**
 * Convert Durations to milliseconds
 * @param {string} value The string time value
 * @returns {number}
 */
export function toMS(value: string): number {
    const number = Number(value.replace(/[^-.0-9]+/g, ''));
    value = value.replace(/\s+/g, '');
    if(/\d+(?=y)/i.test(value)) return number * 3.154e+10;
    else if(/\d+(?=w)/i.test(value)) return number * 6.048e+8;
    else if(/\d+(?=d)/i.test(value)) return number * 8.64e+7;
    else if(/\d+(?=h)/i.test(value)) return number * 3.6e+6;
    else if(/\d+(?=m)/i.test(value)) return number * 60000;
    else if(/\d+(?=s)/i.test(value)) return number * 1000;
    else if(/\d+(?=ms|milliseconds?)/i.test(value)) return number;
    throw new Error(`Something went wrong while converting value "${value}" with function toMS()`);
};