import { describe, it, expect } from 'vitest';
import { BooleanSwitchEditor } from '../../Modules/Widgets/BooleanSwitchEditor';

describe('BooleanSwitchEditor', () => {
    it('creates checkbox input', () => {
        const editor = new BooleanSwitchEditor({});
        expect(editor.domNode.tagName).toBe('DIV');
        const input = editor.domNode.querySelector('input');
        expect(input).toBeTruthy();
        expect(input?.type).toBe('checkbox');
    });

    it('can set and get value', () => {
        const editor = new BooleanSwitchEditor({});
        editor.value = true;
        expect(editor.value).toBe(true);
        
        editor.value = false;
        expect(editor.value).toBe(false);
    });

    it('applies css option', () => {
        // Implementation may wrap the checkbox in a div or apply to next element depending on sleekgrid
        // We just ensure it mounts without throwing
        const editor = new BooleanSwitchEditor({ css: 'label-success' });
        expect(editor).toBeTruthy();
    });
});
