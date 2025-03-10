export type CompactUnit = 'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'y';
type BaseFullUnit = 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'year';

export interface Option {
    compactDuration?: boolean,
    avoidDuration?: Array<CompactUnit>
}
export interface DurationInterface {
    short: CompactUnit
    long: BaseFullUnit
    duration: number
}

type FullUnit = `${BaseFullUnit}s` | BaseFullUnit;

export type TimeFormat =
    | `${number}${CompactUnit}`      // "1m", "2h"
    | `${number} ${CompactUnit}`     // "1 m", "2 h"
    | `${number}${FullUnit}`         // "1second", "2minutes"
    | `${number} ${FullUnit}`;       // "1 second", "2 minutes"