import {
    confirmDialog,
    getLookupAsync,
    localText,
    notifyWarning,
    serviceRequest,
    type Lookup
} from "@serenity-is/corelib";
import { JsonDataDialog, type DynamicFieldDef } from "@bizeka/extensions";
import { DynamicFormDefinitionDialog } from "../DynamicFormDefinition/DynamicFormDefinitionDialog";

export interface DynamicFormDefinitionRow {
    Id?: number;
    FormKey?: string;
    DefinitionJson?: string;
}

/**
 * DynamicBaseDialog inherits from Bizeka.Extensions.JsonDataDialog for core JSON form handling,
 * and adds visual Form Designer actions.
 */
export class DynamicBaseDialog<TRow, TOptions = any> extends JsonDataDialog<TRow, TOptions> {
    static override [Symbol.typeInfo] = this.registerClass("Bizeka.DynamicForms.DynamicBaseDialog");

    private dynamicFormLookup?: Lookup<DynamicFormDefinitionRow>;

    protected override useAsync(): boolean {
        return true;
    }

    protected override async getPropertyItemsDataAsync() {
        try {
            this.dynamicFormLookup = await getLookupAsync<DynamicFormDefinitionRow>(this.getDynamicFormLookupKey());
        }
        catch {
            this.dynamicFormLookup = undefined;
        }

        return super.getPropertyItemsDataAsync();
    }

    protected text(key: string, fallback: string) {
        return localText(`Site.DynamicForms.${key}`, fallback);
    }

    protected getDynamicFormLookupKey() {
        return "DynamicForms.DynamicFormDefinition";
    }

    protected getDynamicSchemaFormKey() {
        return this.getFormKey();
    }

    protected getDesignService() {
        return "DynamicForms/DynamicFormDefinition";
    }

    protected override getToolbarButtons() {
        const buttons = super.getToolbarButtons() || [];

        buttons.push({
            title: this.text("Dialog.FormDesign", "Form Design"),
            cssClass: "design-mode-button",
            icon: "fa-cogs text-orange",
            separator: true,
            onClick: () => this.openFieldDesigner()
        });

        return buttons;
    }

    protected override getDynamicSchema(): DynamicFieldDef[] {
        const formKey = this.getDynamicSchemaFormKey();
        const lookup = this.dynamicFormLookup;
        const item = lookup?.items?.find(x => x.FormKey === formKey);

        if (!item?.DefinitionJson)
            return [] as DynamicFieldDef[];

        try {
            return JSON.parse(item.DefinitionJson) as DynamicFieldDef[];
        }
        catch {
            notifyWarning(localText("Site.DynamicForms.InvalidDefinitionJson").replace("{0}", formKey));
            return [] as DynamicFieldDef[];
        }
    }

    protected createFieldDesignerDialog(): any {
        return new DynamicFormDefinitionDialog();
    }

    protected openFieldDesigner() {
        const formKey = this.getDynamicSchemaFormKey();

        serviceRequest<any>(`${this.getDesignService()}/List`, {
            EqualityFilter: { FormKey: formKey }
        }, response => {
            const dlg = this.createFieldDesignerDialog();
            dlg.onClose(() => confirmDialog(this.text("Dialog.ReloadPrompt", "Form definition changed. Reload the page?"), () => window.location.reload()));

            if (response?.Entities?.length > 0) {
                dlg.loadByIdAndOpenDialog(response.Entities[0].Id);
                return;
            }

            dlg.loadNewAndOpenDialog();
            dlg.onOpen(() => {
                dlg.setFormKey(formKey);
            }, { oneOff: true });
        });
    }
}
