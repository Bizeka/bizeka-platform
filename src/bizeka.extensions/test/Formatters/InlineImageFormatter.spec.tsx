import { describe, it, expect } from 'vitest';
import { InlineImageFormatter } from '../../Modules/Formatters/InlineImageFormatter';
import { FormatterContext } from '@serenity-is/sleekgrid';

describe('InlineImageFormatter', () => {
    it('returns empty string if value is null', () => {
        const formatter = new InlineImageFormatter();
        const result = formatter.format({ value: null } as FormatterContext) as HTMLElement;
        expect(result.tagName).toBe('A');
    });

    it('renders image tag with proper src', () => {
        const formatter = new InlineImageFormatter();
        const result = formatter.format({ value: 'my/image.png' } as FormatterContext) as HTMLElement;
        
        expect(result.tagName).toBe('A');
        const img = result.querySelector('img');
        expect(img).toBeTruthy();
        expect(img?.src).toContain('my/image.png');
    });

    it('appends _t.jpg if thumb option is true', () => {
        const formatter = new InlineImageFormatter({ thumb: true });
        const result = formatter.format({ value: 'my/image.png' } as FormatterContext) as HTMLElement;
        
        const img = result.querySelector('img');
        expect(img?.src).toContain('my/image_t.jpg');
    });

    it('applies max height and width', () => {
        const formatter = new InlineImageFormatter({ maxHeight: '50px', maxWidth: '100px' });
        const result = formatter.format({ value: 'img.png' } as FormatterContext) as HTMLElement;
        
        const img = result.querySelector('img');
        expect(img?.style.maxHeight).toBe('50px');
        expect(img?.style.maxWidth).toBe('100px');
    });
});
