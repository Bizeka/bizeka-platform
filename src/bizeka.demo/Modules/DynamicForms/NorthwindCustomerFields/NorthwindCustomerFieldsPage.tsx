import { DynamicBaseDialog } from "@bizeka/dynamicforms";
import { Attributes, notifySuccess, type SaveInitiator, type SaveResponse, type ServiceOptions } from "@serenity-is/corelib";
import { CustomerForm, CustomerRow, CustomerService } from "@serenity-is/demo.northwind";
import { sampleText, SampleInfo, SampleOutput, samplePanel } from "../../Common/SampleInfo";

/** Definition seeded by the Bizeka.Demo migration DefaultDB_20261022_1200. */
const definitionKey = "Northwind.Customer.OpenSource";

export default async function pageInit() {
    SampleInfo({
        uses: ["DynamicBaseDialog", "DynamicFormDefinition"]
    });

    const first = await CustomerService.List({ Take: 1, Sort: [CustomerRow.Fields.CompanyName] });
    const customerId = first.Entities?.[0]?.[CustomerRow.idProperty];
    const dialog = new NorthwindCustomerFieldsDialog();
    dialog.load(customerId ?? {}, () => {
        samplePanel().append(dialog.domNode, dialog.output);
        dialog.domNode.hidden = false;
        dialog.arrange();
    });
}

export class NorthwindCustomerFieldsDialog extends DynamicBaseDialog<CustomerRow> {
    static override [Symbol.typeInfo] = this.registerClass("Bizeka.Demo.NorthwindCustomerFieldsDialog", [Attributes.panel]);

    readonly output = SampleOutput({ title: sampleText("NorthwindCustomerFields.SaveRequestNotSent") });

    protected override getFormKey() { return CustomerForm.formKey; }
    protected override getRowDefinition() { return CustomerRow; }
    protected override getService() { return CustomerService.baseUrl; }
    protected override getDynamicSchemaFormKey() { return definitionKey; }

    protected override saveHandler(options: ServiceOptions<SaveResponse>): PromiseLike<SaveResponse> {
        this.output.show(options.request);
        const response: SaveResponse = { EntityId: this.entityId };
        options.onSuccess?.(response);
        return Promise.resolve(response);
    }

    protected override onSaveSuccess(_response: SaveResponse, _initiator?: SaveInitiator) {
        notifySuccess(sampleText("NorthwindCustomerFields.NotStoredTheRequestIsShown"));
    }

    protected override updateInterface() {
        super.updateInterface();
        this.deleteButton?.hide();
        this.saveAndCloseButton?.hide();
        this.cloneButton?.hide();
    }
}
