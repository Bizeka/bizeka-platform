import { AutoCompleteEditor, EmptyLookupEditor, TagListEditor } from "@bizeka/extensions";
import { initFormType, PrefixedContext } from "@serenity-is/corelib";

export interface TagsAndSuggestionsForm {
    Labels: TagListEditor;
    City: AutoCompleteEditor;
    SalesRegion: EmptyLookupEditor;
}

export class TagsAndSuggestionsForm extends PrefixedContext {
    static readonly formKey = 'Demo.Editors.TagsAndSuggestions';
    declare private static init: boolean;

    constructor(...args: ConstructorParameters<typeof PrefixedContext>) {
        super(...args);

        if (!TagsAndSuggestionsForm.init) {
            TagsAndSuggestionsForm.init = true;

            initFormType(TagsAndSuggestionsForm, [
                'Labels', TagListEditor,
                'City', AutoCompleteEditor,
                'SalesRegion', EmptyLookupEditor
            ]);
        }
    }
}