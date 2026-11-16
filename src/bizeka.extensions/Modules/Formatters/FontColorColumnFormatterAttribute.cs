using Serenity.ComponentModel;

namespace Bizeka.Extensions;

    public partial class FontColorColumnFormatterAttribute : CustomFormatterAttribute
    {
        public const string Key = "Bizeka.Extensions.FontColorColumnFormatter";

        public FontColorColumnFormatterAttribute()
            : base(Key)
        {
        }

        public string? ColorProperty
        {
            get => GetOption<string?>("colorProperty");
            set => SetOption("colorProperty", value);
        }

        public string? Color
        {
            get => GetOption<string?>("color");
            set => SetOption("color", value);
        }
    }
