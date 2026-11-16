import { describe, it, expect } from 'vitest';
import { CheckboxButtonEditor } from '../../Modules/Widgets/CheckboxButtonEditor';

describe('CheckboxButtonEditor', () => {
    it('creates wrapper div', () => {
        const editor = new CheckboxButtonEditor({});
        expect(editor.domNode.tagName).toBe('DIV');
    });

    it('can set and get values', () => {
        const myEnum = { '1': 'Option 1', '2': 'Option 2' };
        const editor = new CheckboxButtonEditor({ enumType: myEnum });
        editor.value = '1,2';
        expect(editor.value).toBe('1,2');
    });
});
