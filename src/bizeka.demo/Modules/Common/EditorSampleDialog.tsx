import { PropertyDialog, type ToolButton } from "@serenity-is/corelib";
import { sampleText, SampleOutput, samplePanel } from "./SampleInfo";

/**
 * A property dialog rendered inline (subclasses register with Attributes.panel) whose
 * "Read Values" button validates the form and shows exactly what the editors save.
 */
export abstract class EditorSampleDialog<P = {}> extends PropertyDialog<any, P> {
    protected readonly output = SampleOutput({ title: sampleText("Common.SavedEntity") });

    // PropertyDialog renders no toolbar; add one above the form, as EntityDialog does.
    protected override renderContents(): any {
        const id = this.useIdPrefix();
        return <>
            <div id={id.Toolbar} />
            <div class="s-Form">
                <form id={id.Form} action="">
                    <div id={id.PropertyGrid} />
                </form>
            </div>
        </>;
    }

    protected override getToolbarButtons(): ToolButton[] {
        return [{
            title: sampleText("Common.ReadValues"),
            icon: "fa-code",
            cssClass: "read-values-button",
            onClick: () => this.readValues()
        }];
    }

    protected override getDialogButtons() {
        return [];
    }

    protected readValues() {
        if (this.validateForm())
            this.output.show(this.getSaveEntity());
    }

    /** Adds the dialog and its output block to the sample container. */
    mount(): this {
        const panel = samplePanel();
        panel.append(this.domNode, this.output);
        this.domNode.hidden = false;
        this.arrange();
        return this;
    }
}
