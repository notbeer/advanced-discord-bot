import { toMS } from './toMS';
import { toDuration } from './toDuration';

import { Option } from '../../@types/lib/ms';

function isError(error: unknown): error is Error {
    return typeof error === 'object' && error !== null && 'message' in error;
};

function MS(value: string): number;
function MS(value: number, option?: Option): string;
/**
 * Format millisecond to formatted time or vise versa
 * @param {string | number} value - Value to convert
 * @param {Option} option - Options for the conversion
 * @returns {string | number | null}
 */
function MS(value: string | number, option?: Option): string | number {
    try {
        if(typeof value === 'string') {
            if(/^\d+$/.test(value)) return Number(value);

            const durations = value.match(/\s*-?\s*\d*\.?\d+\s*?(years?|yrs?|weeks?|days?|hours?|hrs?|minutes?|mins?|seconds?|secs?|milliseconds?|msecs?|ms|[smhdwy])/gi);
            if(durations) return durations.reduce((a, b) => a + toMS(b), 0);

            throw new Error('Value is not a valid string');
        };
        if(typeof value === 'number') return toDuration(value, { compactDuration: option?.compactDuration, avoidDuration: option?.avoidDuration });
        throw new Error('Value is not a valid string nor number');
    } catch(err) {  
        const message = isError(err)
        ? `${err.message}. Value = ${JSON.stringify(value)}`
        : 'An unknown error has occured.';
        throw new Error(message);
    };
};

export default MS;