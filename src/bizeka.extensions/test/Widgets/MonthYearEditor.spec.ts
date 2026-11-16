import { describe, it, expect } from 'vitest';
import { MonthYearEditor } from '../../Modules/Widgets/MonthYearEditor';

describe('MonthYearEditor', () => {
    it('creates Serenity selectors', () => {
        const editor = new MonthYearEditor({});
        expect(editor).toBeTruthy();
        expect(editor.domNode.querySelectorAll('select')).toHaveLength(0);
        expect(editor.domNode.querySelectorAll('.select2-container')).toHaveLength(2);
    });

    it('sets correct date value', () => {
        const editor = new MonthYearEditor({});
        editor.value = '2026-10-05';
        // Should parse and normalize day to 1
        expect(editor.value).toContain('2026-10');
    });
});
