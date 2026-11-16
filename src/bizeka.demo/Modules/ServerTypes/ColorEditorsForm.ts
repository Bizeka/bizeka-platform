import { ColorHexEditor, ColorPickerEditor } from "@bizeka/extensions";
import { initFormType, PrefixedContext } from "@serenity-is/corelib";

export interface ColorEditorsForm {
    BrandColor: ColorHexEditor;
    HighlightColor: ColorPickerEditor;
}

export class ColorEditorsForm extends PrefixedContext {
    static readonly formKey = 'Demo.Editors.ColorEditors';
    declare private static init: boolean;

    constructor(...args: ConstructorParameters<typeof PrefixedContext>) {
        super(...args);

        if (!ColorEditorsForm.init) {
            ColorEditorsForm.init = true;

            initFormType(ColorEditorsForm, [
                'BrandColor', ColorHexEditor,
                'HighlightColor', ColorPickerEditor
            ]);
        }
    }
}