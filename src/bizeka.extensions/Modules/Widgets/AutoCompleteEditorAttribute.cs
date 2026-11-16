using Serenity.ComponentModel;

namespace Bizeka.Extensions;

    public partial class AutoCompleteEditorAttribute : CustomEditorAttribute
    {
        public const string Key = "Bizeka.Extensions.AutoCompleteEditor";

        public AutoCompleteEditorAttribute()
            : base(Key)
        {
        }

        public string? LookupKey
        {
            get => GetOption<string?>("lookupKey");
            set => SetOption("lookupKey", value);
        }
    }
