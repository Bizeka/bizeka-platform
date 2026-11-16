import { describe, it, expect } from 'vitest';
import { MonthYearFormatter } from '../../Modules/Formatters/MonthYearFormatter';
import { FormatterContext } from '@serenity-is/sleekgrid';

describe('MonthYearFormatter', () => {
    it('returns empty string if value is null', () => {
        const formatter = new MonthYearFormatter();
        expect(formatter.format({ value: null } as FormatterContext)).toBe('');
    });

    // No enum registration is required: a host without a "Months" enum must still format.
    it('formats a MonthYearEditor value with culture month names', () => {
        const formatter = new MonthYearFormatter();
        expect(formatter.format({ value: '2026-10' } as FormatterContext)).toBe('Oct 2026');
    });

    it('uses the month names of the page language', () => {
        const formatter = new MonthYearFormatter();
        document.documentElement.lang = 'tr-TR';
        try {
            expect(formatter.format({ value: '2026-10' } as FormatterContext)).toBe('Eki 2026');
        } finally {
            document.documentElement.lang = '';
        }
    });
});
