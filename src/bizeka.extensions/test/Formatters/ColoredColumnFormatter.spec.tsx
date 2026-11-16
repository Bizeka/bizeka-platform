import { describe, it, expect } from 'vitest';
import { ColoredColumnFormatter } from '../../Modules/Formatters/ColoredColumnFormatter';
import { FormatterContext, Column } from '@serenity-is/sleekgrid';

describe('ColoredColumnFormatter', () => {
    it('returns empty string if value is empty', () => {
        const formatter = new ColoredColumnFormatter();
        expect(formatter.format({ value: null } as FormatterContext)).toBe('');
    });

    it('sets static background color', () => {
        const formatter = new ColoredColumnFormatter({ backgroundColor: '#ff0000' });
        const result = formatter.format({ value: 'Test' } as FormatterContext) as HTMLElement;
        
        expect(result.style.backgroundColor).toBe('rgb(255, 0, 0)');
        expect(result.textContent).toBe('Test');
    });

    it('keeps the text readable on a hex background', () => {
        const pale = new ColoredColumnFormatter({ backgroundColor: '#dbeafe' }).format({ value: 'Test' } as FormatterContext) as HTMLElement;
        const dark = new ColoredColumnFormatter({ backgroundColor: '#123' }).format({ value: 'Test' } as FormatterContext) as HTMLElement;

        expect(pale.style.color).toBe('rgb(31, 41, 55)');
        expect(dark.style.color).toBe('rgb(255, 255, 255)');
    });

    it('hides text if hideText is true', () => {
        const formatter = new ColoredColumnFormatter({ backgroundColor: '#ff0000', hideText: true });
        const result = formatter.format({ value: 'Test' } as FormatterContext) as HTMLElement;
        
        expect(result.textContent).toBe('');
    });

    it('gets background color from item property', () => {
        const formatter = new ColoredColumnFormatter({ backgroundProperty: 'MyColor' });
        const ctx = { value: 'Test', item: { MyColor: 'blue' } } as FormatterContext;
        const result = formatter.format(ctx) as HTMLElement;
        
        expect(result.style.backgroundColor).toBe('blue');
    });

    it('initializes column with referenced fields', () => {
        const formatter = new ColoredColumnFormatter({ backgroundProperty: 'BgColor', borderProperty: 'BdColor' });
        const column = { referencedFields: [] } as any as Column;
        formatter.initializeColumn(column);
        
        expect(column.referencedFields).toContain('BgColor');
        expect(column.referencedFields).toContain('BdColor');
    });
});
