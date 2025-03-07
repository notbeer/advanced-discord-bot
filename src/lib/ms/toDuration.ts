import {
    DurationInterface,
    CompactUnit
} from '../../@types/lib/ms';

/**
 * Convert milliseconds to formatted time
 * @param {number} value Millisecond to convert
 * @returns {string}
 */
export function toDuration(value: number, { compactDuration, avoidDuration }: { compactDuration?: boolean, avoidDuration?: Array<CompactUnit> } = {}): string {
    const absMs = Math.abs(value);
    const duration: Array<DurationInterface> = [
        { short: 'w', long: 'week', duration: Math.floor(absMs / 6.048e+8) },
        { short: 'd', long: 'day', duration: Math.floor(absMs / 8.64e+7) % 7 },
        { short: 'h', long: 'hour', duration: Math.floor(absMs / 3.6e+6) % 24 },
        { short: 'm', long: 'minute', duration: Math.floor(absMs / 60000) % 60 },
        { short: 's', long: 'second', duration: Math.floor(absMs / 1000) % 60 },
        { short: 'ms', long: 'millisecond', duration: absMs % 1000 }
    ];
    const mappedDuration = duration
        .filter(obj => obj.duration !== 0 && avoidDuration ? !avoidDuration.includes(obj.short) : obj.duration)
        .map(obj => `${Math.sign(value) === -1 ? '-' : ''}${compactDuration ? `${Math.floor(obj.duration)}${obj.short}` : `${Math.floor(obj.duration)} ${obj.long}${obj.duration === 1 ? '' : 's'}`}`);
    
    return mappedDuration.join(compactDuration ? ' ' : ', ') || `${absMs}`;
};