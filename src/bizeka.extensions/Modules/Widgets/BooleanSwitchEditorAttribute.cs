using Serenity.ComponentModel;

namespace Bizeka.Extensions;

    public partial class BooleanSwitchEditorAttribute : CustomEditorAttribute
    {
        public const string Key = "Bizeka.Extensions.BooleanSwitchEditor";

        public BooleanSwitchEditorAttribute()
            : base(Key)
        {
        }

        public string? Css
        {
            get => GetOption<string?>("css");
            set => SetOption("css", value);
        }
    }
