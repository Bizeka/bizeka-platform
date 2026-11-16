import { classTypeInfo, EntityGrid, registerType, WidgetProps } from "@serenity-is/corelib";

export abstract class BizekaEntityGrid<Entity, Options = any> extends EntityGrid<Entity, Options> {
    static override [Symbol.typeInfo] = classTypeInfo("Bizeka.Extensions.BizekaEntityGrid");
    static { registerType(this); }

    constructor(props: WidgetProps<Options>) {
        super(props);
    }

    protected override getSlickOptions() {
        const options = super.getSlickOptions();
        options.editorLock = undefined;
        options.enableCellNavigation = true;
        return options;
    }
}
