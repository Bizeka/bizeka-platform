import { describe, it, expect, vi } from 'vitest';
import { YesNoColoredFormatter } from '../../Modules/Formatters/YesNoColoredFormatter';
import { FormatterContext } from '@serenity-is/sleekgrid';

describe('YesNoColoredFormatter', () => {
    it('returns success label for true value', () => {
        const formatter = new YesNoColoredFormatter();
        const ctx = { value: true } as FormatterContext;
        const result = formatter.format(ctx) as HTMLElement;
        
        expect(result.tagName).toBe('SPAN');
        expect(result.className).toContain('label-success');
    });

    it('returns danger label for false value', () => {
        const formatter = new YesNoColoredFormatter();
        const ctx = { value: false } as FormatterContext;
        const result = formatter.format(ctx) as HTMLElement;
        
        expect(result.tagName).toBe('SPAN');
        expect(result.className).toContain('label-danger');
    });
});
