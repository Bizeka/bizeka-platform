import { describe, it, expect, vi } from 'vitest';
import { StaticTextBlock } from '../../Modules/Widgets/StaticTextBlock';

describe('StaticTextBlock', () => {
    it('sets text content if isHtml is false', () => {
        const editor = new StaticTextBlock({ text: '<b>Test</b>', isHtml: false });
        expect(editor.domNode.innerHTML).not.toContain('<b>');
        expect(editor.domNode.textContent).toBe('<b>Test</b>');
    });

    it('sets html content if isHtml is true', () => {
        const editor = new StaticTextBlock({ text: '<b>Test</b>', isHtml: true });
        expect(editor.domNode.innerHTML).toContain('<b>Test</b>');
    });

    it('hides label if hideLabel is true', () => {
        const field = document.createElement('div');
        field.className = 'field';
        const label = document.createElement('label');
        label.className = 'caption';
        field.appendChild(label);
        
        const editorNode = document.createElement('div');
        field.appendChild(editorNode);
        
        // This test simulates the DOM structure
        const editor = new (StaticTextBlock as any)({ hideLabel: true, element: editorNode });
        // Since constructor executes during base init or directly, depending on Serenity version
        // We'll just verify the label is hidden
        expect(label.hidden).toBe(true);
    });

    it('setEditValue sets value correctly', () => {
        const editor = new StaticTextBlock({});
        editor.setEditValue({ myField: 'dynamic text' }, { name: 'myField' });
        expect(editor.domNode.textContent).toBe('dynamic text');
    });
});
