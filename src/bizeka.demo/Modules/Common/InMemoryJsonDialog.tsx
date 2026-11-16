import { JsonDataDialog } from "@bizeka/extensions";
import { notifySuccess, type RetrieveResponse, type SaveInitiator, type SaveResponse, type ServiceOptions } from "@serenity-is/corelib";
import { sampleText, SampleOutput, samplePanel } from "./SampleInfo";

/**
 * A JsonDataDialog that does not call a service: saving shows the request the dialog
 * would send. Subclasses register with Attributes.panel and provide the form and schema.
 */
export abstract class InMemoryJsonDialog<TRow = any> extends JsonDataDialog<TRow> {
    protected readonly output = SampleOutput({ title: sampleText("Common.SaveRequestSentToTheService") });

    /** Plays the part of the database: Apply Changes reloads the record from here. */
    private saved?: TRow;

    protected override getIdProperty() { return "Id"; }

    protected override saveHandler(options: ServiceOptions<SaveResponse>): PromiseLike<SaveResponse> {
        this.output.show(options.request);
        const request = options.request as any;
        const response: SaveResponse = { EntityId: request?.EntityId ?? 1 };
        this.saved = { ...request?.Entity, Id: response.EntityId };
        options.onSuccess?.(response);
        return Promise.resolve(response);
    }

    protected override loadByIdHandler(options: ServiceOptions<RetrieveResponse<TRow>>,
        callback: (response: RetrieveResponse<TRow>) => void): PromiseLike<RetrieveResponse<TRow>> {
        const response: RetrieveResponse<TRow> = { Entity: this.saved ?? {} as TRow };
        callback?.(response);
        return Promise.resolve(response);
    }

    protected override onSaveSuccess(_response: SaveResponse, _initiator?: SaveInitiator) {
        notifySuccess(sampleText("Common.NotStoredThisSampleOnlyShows"));
    }

    protected override updateInterface() {
        super.updateInterface();
        this.deleteButton?.hide();
        this.saveAndCloseButton?.hide();
        this.localizerButton?.hide();
        this.cloneButton?.hide();
    }

    /** Loads an entity and adds the dialog and its output block to the sample container. */
    mount(entity: TRow): this {
        // load() instead of loadEntityAndOpenDialog(): opening as a panel would take over the whole page.
        this.load(entity, () => {
            samplePanel().append(this.domNode, this.output);
            this.domNode.hidden = false;
            this.arrange();
        });
        return this;
    }
}
