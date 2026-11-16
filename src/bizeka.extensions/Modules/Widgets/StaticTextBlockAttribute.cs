using Serenity.ComponentModel;

namespace Bizeka.Extensions;

    public partial class StaticTextBlockAttribute : CustomEditorAttribute
    {
        public const string Key = "Bizeka.Extensions.StaticTextBlock";

        public StaticTextBlockAttribute()
            : base(Key)
        {
        }

        public string? Text
        {
            get => GetOption<string?>("text");
            set => SetOption("text", value);
        }

        public bool IsHtml
        {
            get => GetOption<bool>("isHtml");
            set => SetOption("isHtml", value);
        }

        public bool IsLocalText
        {
            get => GetOption<bool>("isLocalText");
            set => SetOption("isLocalText", value);
        }

        public bool HideLabel
        {
            get => GetOption<bool>("hideLabel");
            set => SetOption("hideLabel", value);
        }

        public bool IsDate
        {
            get => GetOption<bool>("isDate");
            set => SetOption("isDate", value);
        }

        public bool IsDateTime
        {
            get => GetOption<bool>("isDateTime");
            set => SetOption("isDateTime", value);
        }
    }
