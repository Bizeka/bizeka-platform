import { StaticTextBlock } from "@bizeka/extensions";
import { initFormType, PrefixedContext, StringEditor } from "@serenity-is/corelib";

export interface StaticTextForm {
    Instructions: StaticTextBlock;
    RequestTitle: StringEditor;
    Checklist: StaticTextBlock;
    FromLocalText: StaticTextBlock;
    LastReviewed: StaticTextBlock;
    ReviewerNote: StaticTextBlock;
}

export class StaticTextForm extends PrefixedContext {
    static readonly formKey = 'Demo.Editors.StaticText';
    declare private static init: boolean;

    constructor(...args: ConstructorParameters<typeof PrefixedContext>) {
        super(...args);

        if (!StaticTextForm.init) {
            StaticTextForm.init = true;

            initFormType(StaticTextForm, [
                'Instructions', StaticTextBlock,
                'RequestTitle', StringEditor,
                'Checklist', StaticTextBlock,
                'FromLocalText', StaticTextBlock,
                'LastReviewed', StaticTextBlock,
                'ReviewerNote', StaticTextBlock
            ]);
        }
    }
}