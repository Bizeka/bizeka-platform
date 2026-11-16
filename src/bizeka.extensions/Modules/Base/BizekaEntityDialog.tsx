import { classTypeInfo, DeleteResponse, EntityDialog, registerType, RetrieveResponse, SaveResponse, WidgetProps } from "@serenity-is/corelib";

export abstract class BizekaEntityDialog<Entity, Options = any> extends EntityDialog<Entity, Options> {
    static override [Symbol.typeInfo] = classTypeInfo("Bizeka.Extensions.BizekaEntityDialog");
    static { registerType(this); }

    constructor(props?: WidgetProps<Options>) {
        super(props);
    }

    public override updateTitle(): void {
        super.updateTitle();
    }

    protected override save(opt?: any): PromiseLike<SaveResponse> | false {
        return super.save(opt);
    }

    public override loadById(id: any): PromiseLike<RetrieveResponse<Entity>> {
        return super.loadById(id);
    }

    protected override doDelete(callback?: (response: DeleteResponse) => void): PromiseLike<DeleteResponse> {
        return super.doDelete(callback ?? (() => {}));
    }
}
