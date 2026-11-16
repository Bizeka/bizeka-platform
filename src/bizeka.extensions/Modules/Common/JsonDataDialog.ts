import {
    BooleanEditor,
    classTypeInfo,
    DateEditor,
    DateTimeEditor,
    DecimalEditor,
    EntityDialog,
    IntegerEditor,
    localText,
    notifyWarning,
    PropertyItem,
    registerType,
    StringEditor,
    TextAreaEditor
} from "@serenity-is/corelib";
import type { DynamicFieldDef } from "./DynamicFieldDef";

/**
 * Reusable base dialog for entities persisting dynamic fields into a JSON column.
 * Handles dynamic property injection, JSON loading, and JSON serialization.
 */
export abstract class JsonDataDialog<TRow, TOptions = any> extends EntityDialog<TRow, TOptions> {
    static override [Symbol.typeInfo] = classTypeInfo("Bizeka.Extensions.JsonDataDialog");
    static { registerType(this); }

    /**
     * Subclasses must provide the list of dynamic field definitions to inject into the form.
     */
    protected abstract getDynamicSchema(): DynamicFieldDef[];

    protected override afterInit(): void {
        super.afterInit();
        // Async property items can arrive after loadResponse has supplied the entity.
        // Replay that entity once the grid exists, including derived dialog hooks.
        if (this.entity != null) {
            this.loadEntity(this.entity);
            this.afterLoadEntity();
        }
    }

    /**
     * The property name on the row where JSON is stored. Defaults to "DynamicDataJson".
     */
    protected getJsonDataFieldName(): string {
        return "DynamicDataJson";
    }

    protected handlesAdditionalFieldType(_type: string): boolean {
        return false;
    }

    protected override getPropertyItems(): PropertyItem[] {
        const items = super.getPropertyItems() || [];
        const dynamicSchema = this.getDynamicSchema();

        if (!dynamicSchema || !dynamicSchema.length)
            return items;

        const dynamicItems = dynamicSchema.map(x => this.toPropertyItem(x));

        // If the main entity form does NOT have tabs defined, but dynamic fields do have a Tab,
        // we inject a "General" tab for the main form so Serenity creates a standard, unified tabbed dialog.
        const hasExistingTabs = items.some(x => x.tab);
        const hasDynamicTabs = dynamicItems.some(x => x.tab);

        if (!hasExistingTabs && hasDynamicTabs) {
            const generalTab = localText("Site.Extensions.GeneralTab");
            for (const item of items) {
                item.tab = generalTab;
            }
        }

        return items.concat(dynamicItems);
    }

    protected override loadEntity(entity: TRow): void {
        const fieldName = this.getJsonDataFieldName();
        const jsonStr = (entity as any)?.[fieldName];

        if (jsonStr) {
            try {
                const dynamicData = JSON.parse(jsonStr);
                for (const key of Object.keys(dynamicData)) {
                    (entity as any)[key] = dynamicData[key];
                }
            }
            catch {
                notifyWarning(localText("Site.Extensions.InvalidRecordJson").replace("{0}", fieldName));
            }
        }

        super.loadEntity(entity);
    }

    protected override getSaveEntity(): TRow {
        const entity = super.getSaveEntity() as any;
        const dynamicData: Record<string, any> = {};
        const schema = this.getDynamicSchema() || [];

        for (const item of schema) {
            const key = item.Name;
            if (!key)
                continue;

            const value = entity[key];
            if (value !== undefined)
                dynamicData[key] = value;

            delete entity[key];
        }

        const fieldName = this.getJsonDataFieldName();
        entity[fieldName] = Object.keys(dynamicData).length ? JSON.stringify(dynamicData) : null;
        return entity;
    }

    protected toPropertyItem(item: DynamicFieldDef): PropertyItem {
        const key = item.Name ?? "";
        const type = item.Type ?? "1";

        const result: PropertyItem = {
            name: key,
            title: item.Caption ?? key,
            tab: item.Tab || localText("Site.Extensions.DynamicFieldsTab"),
            category: item.Category || undefined,
            insertable: true,
            updatable: true,
            required: item.Required ?? false,
            placeholder: item.Placeholder ?? undefined,
            defaultValue: item.DefaultValue ?? undefined,
            readOnly: item.ReadOnly ?? false
        };

        switch (type) {
            case "2":
                result.editorType = IntegerEditor;
                result.editorParams = this.cleanEditorParams({
                    minValue: this.parseNumberValue(item.MinValue),
                    maxValue: this.parseNumberValue(item.MaxValue)
                });
                break;
            case "3":
                result.editorType = DecimalEditor;
                result.editorParams = this.cleanEditorParams({
                    minValue: item.MinValue,
                    maxValue: item.MaxValue,
                    decimals: item.DecimalDigits
                });
                break;
            case "4":
                result.editorType = DateEditor;
                result.editorParams = this.cleanEditorParams({
                    minValue: item.MinValue,
                    maxValue: item.MaxValue
                });
                break;
            case "8":
                result.editorType = DateTimeEditor;
                result.editorParams = this.cleanEditorParams({
                    minValue: item.MinValue,
                    maxValue: item.MaxValue
                });
                break;
            case "5":
                result.editorType = BooleanEditor;
                break;
            case "7":
                result.editorType = TextAreaEditor;
                result.editorParams = this.cleanEditorParams({ rows: item.TextRows ?? 4 });
                break;
            default:
                result.editorType = StringEditor;
                break;
        }

        if (item.MaxLength)
            result.maxLength = item.MaxLength;

        return result;
    }

    protected parseNumberValue(value?: string): number | undefined {
        if (!value)
            return undefined;

        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : undefined;
    }

    protected cleanEditorParams(params: Record<string, any>): Record<string, any> | undefined {
        const entries = Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "");
        return entries.length ? Object.fromEntries(entries) : undefined;
    }
}
