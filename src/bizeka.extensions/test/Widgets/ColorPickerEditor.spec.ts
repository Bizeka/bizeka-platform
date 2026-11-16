import { describe, it, expect } from 'vitest';
import { ColorPickerEditor } from '../../Modules/Widgets/ColorPickerEditor';

describe('ColorPickerEditor', () => {
    it('uses the shared palette', () => {
        const editor = new ColorPickerEditor({});
        expect(editor.domNode.tagName).toBe('INPUT');
        expect((editor.domNode as HTMLInputElement).type).toBe('text');
    });

    it('gets and sets color', () => {
        const editor = new ColorPickerEditor({});
        editor.value = '#ff0000';
        expect(editor.value).toBe('#ff0000');
    });

    // The hex box alone allowed only the preset colors; the native picker gives any color.
    it('keeps the free color picker and the hex box in sync', async () => {
        const editor = new ColorPickerEditor({});
        const field = document.createElement('div');
        field.className = 'field';
        field.appendChild(editor.domNode);
        document.body.appendChild(field);
        await Promise.resolve();

        const picker = field.querySelector<HTMLInputElement>('input[type="color"]')!;
        expect(picker).not.toBeNull();

        editor.value = '#123abc';
        expect(picker.value).toBe('#123abc');

        picker.value = '#00ff7f';
        picker.dispatchEvent(new Event('input'));
        expect(editor.value).toBe('#00ff7f');
        field.remove();
    });
});
