// @ts-nocheck
import { toMS } from './toMS';
import { toDuration } from './toDuration';

import { CompactUnitAnyCase } from '../../@types/lib/ms';

function isError(error: unknown): error is Error {
    return typeof error === 'object' && error !== null && 'message' in error;
};

function MS(value: string): number;
function MS(value: number, { compactDuration, fullDuration }?: { compactDuration?: boolean, fullDuration?: boolean }): string;
function MS(value: number, { fullDuration, avoidDuration }?: { fullDuration: boolean, avoidDuration: Array<CompactUnitAnyCase> }): string;
function MS(value: string | number, { compactDuration, fullDuration, avoidDuration }: { compactDuration?: boolean, fullDuration?: boolean, avoidDuration?: Array<CompactUnitAnyCase> } = {}): string | number | null {
    try {
        if(typeof value === 'string') {
            if(/^\d+$/.test(value)) return Number(value);
            const durations = value.match(/\s*-?\s*\d*\.?\d+\s*?(years?|yrs?|weeks?|days?|hours?|hrs?|minutes?|mins?|seconds?|secs?|milliseconds?|msecs?|ms|[smhdwy])/gi);
            return durations ? durations.reduce((a, b) => a + toMS(b), 0) : null;
        };
        if(typeof value === 'number') return toDuration(value, { compactDuration, fullDuration, avoidDuration });
        throw new Error('Value is not a string or a number');
    } catch(err) {  
        const message = isError(err)
        ? `${err.message}. Value = ${JSON.stringify(value)}`
        : 'An unknown error has occured.';
        throw new Error(message);
    };
};

export default MS;