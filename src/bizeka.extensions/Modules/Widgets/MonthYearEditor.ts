import { Widget, WidgetProps, PropertyItem, SelectEditor } from "@serenity-is/corelib";

export class MonthYearEditor extends Widget<any> {
    static override [Symbol.typeInfo] = this.registerEditor("Bizeka.Extensions.MonthYearEditor");

    private monthSelect: SelectEditor;
    private yearSelect: SelectEditor;

    constructor(props: WidgetProps<any>) {
        super(props);

        this.domNode.className = "d-flex gap-2 bzk-month-year-container";
        this.domNode.style.width = "100%";

        this.monthSelect = new SelectEditor({ element: el => this.domNode.appendChild(el) });
        this.yearSelect = new SelectEditor({ element: el => this.domNode.appendChild(el) });
        const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
        for (const month of months) this.monthSelect.addItem({ id: month, text: month });
        const currentYear = new Date().getFullYear();
        for (let year = currentYear - 15; year <= currentYear + 15; year++)
            this.yearSelect.addItem({ id: String(year), text: String(year) });

        // Default to current year and month
        this.yearSelect.value = currentYear.toString();
        this.monthSelect.value = months[new Date().getMonth()];


    }

    public override destroy() {
        this.monthSelect.destroy();
        this.yearSelect.destroy();
        super.destroy();
    }

    public getEditValue(property: PropertyItem, target: any) {
        target[property.name!] = this.value;
    }

    public setEditValue(source: any, property: PropertyItem) {
        this.value = source[property.name!];
    }

    public get value(): string {
        return this.yearSelect.value + "-" + this.monthSelect.value;
    }

    public set value(val: string) {
        if (!val) {
            this.yearSelect.value = new Date().getFullYear().toString();
            this.monthSelect.value = ("0" + (new Date().getMonth() + 1)).slice(-2);
        } else {
            let parts = val.split('-');
            if (parts.length >= 2) {
                this.yearSelect.value = parts[0];
                this.monthSelect.value = parts[1];
            }
        }
    }

    get_readOnly(): boolean {
        return this.monthSelect.readOnly;
    }

    set_readOnly(value: boolean): void {
        this.monthSelect.readOnly = value;
        this.yearSelect.readOnly = value;
    }
}
