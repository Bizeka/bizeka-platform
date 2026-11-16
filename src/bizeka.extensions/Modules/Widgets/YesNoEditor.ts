import { SelectEditor, WidgetProps, localText, PropertyItem } from "@serenity-is/corelib";

export class YesNoEditor extends SelectEditor<any> {
    static override [Symbol.typeInfo] = this.registerEditor("Bizeka.Extensions.YesNoEditor");

    constructor(props: WidgetProps<any>) {
        super(props);
        this.addItem({ id: "1", text: localText('Dialogs.YesButton') });
        this.addItem({ id: "0", text: localText('Dialogs.NoButton') });
    }

    public override getEditValue(property: PropertyItem, target: any) { 
        target[property.name!] = this.valueAsBoolean; 
    }
    
    public override setEditValue(source: any, property: PropertyItem) { 
        this.valueAsBoolean = source[property.name!]; 
    }

    public get valueAsBoolean(): boolean | null {
        let val = this.value;
        if (val === "1") return true;
        else if (val === "0") return false;
        else return null;
    }

    public set valueAsBoolean(val: boolean | null) {
        if (val === true) this.value = "1";
        else if (val === false) this.value = "0";
        else this.value = null as any;
    }
}
