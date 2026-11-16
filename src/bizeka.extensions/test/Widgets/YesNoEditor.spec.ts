import { describe, it, expect } from 'vitest';
import { YesNoEditor } from '../../Modules/Widgets/YesNoEditor';

describe('YesNoEditor', () => {
    it('sets boolean values to 1 and 0 string', () => {
        const editor = new YesNoEditor({});
        editor.setEditValue({ active: true }, { name: 'active' });
        expect(editor.get_value()).toBe('1');
        
        editor.setEditValue({ active: false }, { name: 'active' });
        expect(editor.get_value()).toBe('0');
    });

    it('gets boolean values from 1 and 0 string', () => {
        const editor = new YesNoEditor({});
        editor.value = '1';

        const entity: any = {};
        editor.getEditValue({ name: 'active' } as any, entity);
        expect(entity.active).toBe(true);

        editor.value = '0';
        editor.getEditValue({ name: 'active' } as any, entity);
        expect(entity.active).toBe(false);
    });
});
