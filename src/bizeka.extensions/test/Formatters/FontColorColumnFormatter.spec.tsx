import { describe, it, expect } from 'vitest';
import { FontColorColumnFormatter } from '../../Modules/Formatters/FontColorColumnFormatter';
import { FormatterContext, Column } from '@serenity-is/sleekgrid';

describe('FontColorColumnFormatter', () => {
    it('returns empty string if value is empty', () => {
        const formatter = new FontColorColumnFormatter();
        expect(formatter.format({ value: null } as FormatterContext)).toBe('');
    });

    // Option names must match FontColorColumnFormatterAttribute.ColorProperty.
    it('gets color from item property', () => {
        const formatter = new FontColorColumnFormatter({ colorProperty: 'MyColor' });
        const ctx = { value: 'Text', item: { MyColor: 'green' } } as FormatterContext;
        const result = formatter.format(ctx) as HTMLElement;

        expect(result.style.color).toBe('green');
    });

    it('initializes column with referenced fields', () => {
        const formatter = new FontColorColumnFormatter({ colorProperty: 'MyColor' });
        const column = { referencedFields: [] } as any as Column;
        formatter.initializeColumn(column);

        expect(column.referencedFields).toContain('MyColor');
    });
});
