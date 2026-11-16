import { describe, it, expect } from 'vitest';
import { DynamicFieldsEditor } from '../../Modules/Common/DynamicFieldsEditor';

describe('DynamicFieldsEditor', () => {
    // Definitions are edited by users with DynamicForms:Manage and shown to everyone who opens the designer;
    // names, captions and type codes must stay text even when they contain markup.
    it('encodes HTML in field names, captions and types', () => {
        const field = document.createElement('div');
        field.className = 'field';
        const input = document.createElement('input');
        field.append(input);
        document.body.append(field);

        const editor = new DynamicFieldsEditor({ element: input });
        const name = '<img src=x onerror="alert(1)">';
        const caption = '<b>Bold</b>" data-x="1';
        editor.setEditValue({ Fields: JSON.stringify([{ Name: name, Caption: caption, Type: '<svg/onload=alert(2)>' }]) },
            { name: 'Fields' });

        const list = field.querySelector('.dynamic-editor-wrapper')!;
        expect(list.querySelector('img, b, svg, [data-x]')).toBeNull();
        expect(list.querySelector('.field-key-cell')!.textContent).toBe(name);
        expect(list.textContent).toContain(caption);
    });
});
