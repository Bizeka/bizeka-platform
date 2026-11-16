import { describe, it, expect } from 'vitest';
import { MultipleFileDownloadFormatter } from '../../Modules/Formatters/MultipleFileDownloadFormatter';
import { FormatterContext } from '@serenity-is/sleekgrid';

describe('MultipleFileDownloadFormatter', () => {
    it('returns empty string if value is empty', () => {
        const formatter = new MultipleFileDownloadFormatter();
        expect(formatter.format({ value: '' } as FormatterContext)).toBe('');
    });

    it('renders links for each file', () => {
        const formatter = new MultipleFileDownloadFormatter();
        const jsonStr = JSON.stringify([
            { OriginalName: 'file1.txt', Filename: 'path/to/file1.txt' },
            { OriginalName: 'file2.txt', Filename: 'path/to/file2.txt' }
        ]);
        
        const result = formatter.format({ value: jsonStr } as FormatterContext) as any;
        
        // Domwise fragments are often arrays of HTMLElements or a DocumentFragment
        let childNodes = Array.isArray(result) ? result : (result.childNodes || [result]);
        expect(childNodes.length).toBeGreaterThanOrEqual(2);
        
        const firstLink = childNodes[0] as HTMLAnchorElement;
        expect(firstLink.tagName).toBe('A');
        expect(firstLink.title).toBe('file1.txt');
    });
});
