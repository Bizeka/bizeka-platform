import { describe, it, expect, vi } from 'vitest';
import { EmptyLookupEditor } from '../../Modules/Widgets/EmptyLookupEditor';

// Mock fetch and XHR to prevent NetworkError in LookupEditorBase
(global as any).fetch = vi.fn(() => Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true
}));

class MockXHR {
    open() {}
    send() {}
    setRequestHeader() {}
    onreadystatechange: any;
    readyState = 4;
    status = 200;
    responseText = "{}";
}
(global as any).XMLHttpRequest = MockXHR;

describe('EmptyLookupEditor', () => {
    it('initializes as empty list', () => {
        const editor = new EmptyLookupEditor({});
        expect(editor.items.length).toBe(0);
    });

    // A host has no "Extensions.EmptyLookup" script; looking it up throws and breaks the whole form.
    it('does not look up a lookup script', () => {
        const getLookup = vi.spyOn(EmptyLookupEditor.prototype as any, 'getLookup');
        new EmptyLookupEditor({});
        expect(getLookup).not.toHaveBeenCalled();
        getLookup.mockRestore();
    });

    it('can be populated with setLookupItems', () => {
        const editor = new EmptyLookupEditor({});
        
        const mockLookup: any = {
            idField: 'id',
            textField: 'name',
            items: [
                { id: 1, name: 'Item 1' },
                { id: 2, name: 'Item 2' }
            ]
        };
        editor.setLookupItems(mockLookup);
        expect(editor.items.length).toBe(2);
        expect(editor.items[0].text).toBe('Item 1');
    });
});
