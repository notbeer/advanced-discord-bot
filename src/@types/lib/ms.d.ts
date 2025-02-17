type CompactUnit = 'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'y';
export type CompactUnitAnyCase = compactUnit | Uppercase<compactUnit>;

export interface DurationInterface {
    short: CompactUnitAnyCase
    long: UnitAnyCase
    duration: number;
}