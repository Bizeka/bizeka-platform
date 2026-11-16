import { ColorHexEditor } from "../Editors/ColorHexEditor";

export class ColorPickerEditor extends ColorHexEditor {
    static override [Symbol.typeInfo] = this.registerEditor("Bizeka.Extensions.ColorPickerEditor");

}
