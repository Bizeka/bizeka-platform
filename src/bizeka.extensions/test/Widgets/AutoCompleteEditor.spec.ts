import { describe, it, expect } from 'vitest';
import { AutoCompleteEditor } from '../../Modules/Widgets/AutoCompleteEditor';

describe('AutoCompleteEditor', () => {
    it('creates input text', () => {
        const editor = new AutoCompleteEditor({});
        expect(editor.domNode.tagName).toBe('INPUT');
    });

    it('gets and sets value', () => {
        const editor = new AutoCompleteEditor({});
        editor.set_value('Some Text');
        expect(editor.get_value()).toBe('Some Text');
    });
});
