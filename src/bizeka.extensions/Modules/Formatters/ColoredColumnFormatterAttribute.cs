using Serenity.ComponentModel;

namespace Bizeka.Extensions;

    public partial class ColoredColumnFormatterAttribute : CustomFormatterAttribute
    {
        public const string Key = "Bizeka.Extensions.ColoredColumnFormatter";

        public ColoredColumnFormatterAttribute()
            : base(Key)
        {
        }

        public bool HideText
        {
            get => GetOption<bool>("hideText");
            set => SetOption("hideText", value);
        }

        public string? BackgroundProperty
        {
            get => GetOption<string?>("backgroundProperty");
            set => SetOption("backgroundProperty", value);
        }

        public string? BackgroundColor
        {
            get => GetOption<string?>("backgroundColor");
            set => SetOption("backgroundColor", value);
        }

        public string? BorderProperty
        {
            get => GetOption<string?>("borderProperty");
            set => SetOption("borderProperty", value);
        }

        public string? BorderColor
        {
            get => GetOption<string?>("borderColor");
            set => SetOption("borderColor", value);
        }
    }
