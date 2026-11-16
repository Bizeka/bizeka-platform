import { describe, it, expect } from 'vitest';
import { PhoneEditor } from '../../Modules/Widgets/PhoneEditor';

describe('PhoneEditor', () => {
    it('formats phone numbers on blur', () => {
        const editor = new PhoneEditor({});
        editor.set_value('5551234567');
        // trigger blur or format
        const ev = new Event('blur');
        editor.domNode.dispatchEvent(ev);
        expect(editor.get_value()).toBe('(555) 123-4567');
    });

    it('shows an empty box for a missing value', () => {
        const editor = new PhoneEditor({});
        editor.set_value(undefined as any);
        expect(editor.domNode.value).toBe('');
    });

    it('validates single phone number', () => {
        expect(PhoneEditor.isValidPhone('555123456')).toBe(false); // too short
        expect(PhoneEditor.isValidPhone('5551234567')).toBe(true);
    });

    // Validator custom rules treat any non-null result, even "", as an error.
    it('returns null for a valid number so the form can be saved', () => {
        expect(PhoneEditor.validate('5551234567', false)).toBeNull();
        expect(PhoneEditor.validate('555', false)).toBe('Validation.Bizeka.Phone');
    });

    it('validates multiple phone numbers', () => {
        expect(PhoneEditor.isValidMulti('5551234567, 5559876543', PhoneEditor.isValidPhone)).toBe(true);
    });
});
