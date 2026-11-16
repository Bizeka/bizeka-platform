import { confirmDialog, IGetEditValue, ISetEditValue, localText, PropertyItem, Widget, WidgetProps } from "@serenity-is/corelib";
import { DynamicFieldConfigDialog, DynamicFieldDef } from "./DynamicFieldConfigDialog";

export class DynamicFieldsEditor<P = {}> extends Widget<P> implements IGetEditValue, ISetEditValue {
    static override [Symbol.typeInfo] = this.registerEditor("Bizeka.DynamicForms.DynamicFieldsEditor", [IGetEditValue, ISetEditValue]);

    private items: DynamicFieldDef[] = [];
    private nextId = 1;
    private host!: HTMLDivElement;
    private listHost!: HTMLDivElement;

    private text(key: string, fallback: string) {
        return localText(`Site.DynamicForms.${key}`, localText(`Site.DynamicForms.${key}`, fallback));
    }

    constructor(props: WidgetProps<P>) {
        super(props);
        this.initializeLayout();
    }

    getEditValue(property: PropertyItem, target: any) {
        const cleanItems = this.items.map(({ __id, ...rest }) => rest);
        target[property.name] = JSON.stringify(cleanItems);
    }

    setEditValue(source: any, property: PropertyItem) {
        const jsonStr = source[property.name];

        if (!jsonStr) {
            this.items = [];
            this.renderList();
            return;
        }

        try {
            const parsed = typeof jsonStr === "string" ? JSON.parse(jsonStr) : jsonStr;
            const arr = Array.isArray(parsed) ? parsed : [];
            this.items = arr.map(x => {
                const parsedId = x.__id != null ? Number(x.__id) : NaN;
                const finalId = !isNaN(parsedId) ? parsedId : this.nextId++;
                if (finalId >= this.nextId) this.nextId = finalId + 1;
                return { ...x, __id: finalId };
            });
        }
        catch {
            this.items = [];
        }

        this.renderList();
    }

    private initializeLayout() {
        const element = this.domNode as HTMLInputElement;
        element.style.display = "none";

        const fieldContainer = element.closest(".field") as HTMLElement | null;
        if (fieldContainer) {
            fieldContainer.classList.add("dynamic-fields-field");
        }

        this.host = document.createElement("div");
        this.host.className = "dynamic-editor-wrapper";
        element.insertAdjacentElement("afterend", this.host);

        const toolbar = document.createElement("div");
        toolbar.className = "grid-toolbar s-Serenity-Toolbar s-Toolbar clearfix";
        toolbar.innerHTML = `
<div class="tool-buttons">
  <div class="buttons-outer">
    <div class="buttons-inner">
      <div class="tool-button add-button">
        <div class="button-outer"><span class="button-inner"><i class="fa fa-plus-circle me-1"></i>${this.encode(this.text("Editor.AddField", "Add Field"))}</span></div>
      </div>
    </div>
  </div>
</div>`;

        toolbar.querySelector(".add-button")?.addEventListener("click", () => this.addNewItem());
        this.host.appendChild(toolbar);

        this.listHost = document.createElement("div");
        this.listHost.className = "dynamic-field-list";
        this.host.appendChild(this.listHost);

        this.listHost.addEventListener("click", (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (!target) return;

            const deleteBtn = target.closest<HTMLElement>(".delete-link-react");
            if (deleteBtn) {
                e.preventDefault();
                e.stopPropagation();
                const idStr = deleteBtn.dataset.id || deleteBtn.closest("tr")?.dataset.id;
                const id = parseInt(idStr!, 10);
                if (!isNaN(id)) {
                    this.deleteItem(id);
                }
                return;
            }

            const editLink = target.closest<HTMLElement>(".edit-link-react") || target.closest<HTMLElement>(".field-key-cell");
            if (editLink) {
                e.preventDefault();
                e.stopPropagation();
                const idStr = editLink.dataset.id || editLink.closest("tr")?.dataset.id;
                const id = parseInt(idStr!, 10);
                if (!isNaN(id)) {
                    this.editItem(id);
                }
                return;
            }
        });
    }

    private addNewItem() {
        new DynamicFieldConfigDialog({
            initialData: { Type: "1" },
            onSave: data => {
                data.__id = this.nextId++;
                this.items.push(data);
                this.renderList(true);
            }
        }).dialogOpen();
    }

    private editItem(id: number) {
        const index = this.items.findIndex(x => Number(x.__id) === Number(id));
        if (index < 0)
            return;

        new DynamicFieldConfigDialog({
            initialData: { ...this.items[index] },
            onSave: data => {
                data.__id = id;
                this.items[index] = data;
                this.renderList(true);
            }
        }).dialogOpen();
    }

    private deleteItem(id: number) {
        confirmDialog(this.text("Editor.DeleteConfirm", "Are you sure you want to delete this field?"), () => {
            this.items = this.items.filter(x => Number(x.__id) !== Number(id));
            this.renderList(true);
        });
    }

    private renderList(changed = false) {
        const getTypeName = (typeId?: string) => {
            switch (String(typeId ?? "")) {
                case "1": return this.text("Type.String", "String");
                case "2": return this.text("Type.Integer", "Integer");
                case "3": return this.text("Type.Decimal", "Decimal");
                case "4": return this.text("Type.Date", "Date");
                case "8": return this.text("Type.DateTime", "Date Time");
                case "5": return this.text("Type.Boolean", "Boolean");
                case "6": return this.text("Type.Lookup", "Lookup");
                case "7": return this.text("Type.TextArea", "Text Area");
                case "9": return this.text("Type.HtmlContent", "HTML Content");
                default: return typeId || this.text("Editor.Undefined", "Undefined");
            }
        };

        this.listHost.innerHTML = `
<div class="dynamic-table-scroll-container">
  <table class="table table-bordered table-striped mb-0">
    <thead>
      <tr>
        <th style="width: 25%">${this.encode(this.text("Editor.Key", "Key"))}</th>
        <th style="width: 25%">${this.encode(this.text("Editor.Caption", "Caption"))}</th>
        <th style="width: 20%">${this.encode(this.text("Editor.Type", "Type"))}</th>
        <th style="width: 15%" class="text-center">${this.encode(this.text("Editor.Required", "Required?"))}</th>
        <th style="width: 15%" class="text-center">${this.encode(this.text("Editor.Actions", "Actions"))}</th>
      </tr>
    </thead>
    <tbody>
      ${this.items.length === 0 ? `
      <tr>
        <td colspan="5" class="text-center text-muted p-3">${this.encode(this.text("Editor.NoFields", "No dynamic fields defined yet."))}</td>
      </tr>` : this.items.map(item => `
      <tr data-id="${item.__id}">
        <td class="field-key-cell"><a role="button" tabindex="0" href="#" class="s-EditLink edit-link edit-link-react" data-id="${item.__id}">${this.encode(item.Name)}</a></td>
        <td>${this.encode(item.Caption)}</td>
        <td>${this.encode(getTypeName(item.Type))}</td>
        <td class="text-center">${item.Required ? '<i class="fa fa-check text-success"></i>' : '<span class="text-muted">-</span>'}</td>
        <td class="text-center"><button type="button" class="btn btn-link delete-link-react p-0 text-danger border-0 bg-transparent" data-id="${item.__id}" title="${this.encode(this.text("Editor.Delete", "Delete"))}"><i class="fa fa-trash-o text-danger"></i></button></td>
      </tr>`).join("")}
    </tbody>
  </table>
</div>`;

        this.listHost.querySelectorAll<HTMLElement>(".edit-link-react").forEach(el => {
            el.addEventListener("click", e => {
                e.preventDefault();
                e.stopPropagation();
                const id = parseInt(el.dataset.id || el.closest("tr")?.dataset.id || "", 10);
                if (!isNaN(id)) {
                    this.editItem(id);
                }
            });
            el.addEventListener("keydown", e => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    const id = parseInt(el.dataset.id || el.closest("tr")?.dataset.id || "", 10);
                    if (!isNaN(id)) {
                        this.editItem(id);
                    }
                }
            });
        });

        this.listHost.querySelectorAll<HTMLElement>(".delete-link-react").forEach(el => {
            el.addEventListener("click", e => {
                e.preventDefault();
                e.stopPropagation();
                const id = parseInt(el.dataset.id || el.closest("tr")?.dataset.id || "", 10);
                if (!isNaN(id)) {
                    this.deleteItem(id);
                }
            });
        });

        if (changed)
            this.element.trigger("change");
    }

    private encode(value?: string) {
        return (value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll("\"", "&quot;");
    }
}
