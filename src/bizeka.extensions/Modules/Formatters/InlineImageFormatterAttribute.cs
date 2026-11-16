using Serenity.ComponentModel;

namespace Bizeka.Extensions;

    public partial class InlineImageFormatterAttribute : CustomFormatterAttribute
    {
        public const string Key = "Bizeka.Extensions.InlineImageFormatter";

        public InlineImageFormatterAttribute()
            : base(Key)
        {
        }

        public string? FileProperty
        {
            get => GetOption<string?>("fileProperty");
            set => SetOption("fileProperty", value);
        }

        public bool Thumb
        {
            get => GetOption<bool>("thumb");
            set => SetOption("thumb", value);
        }

        public string? MaxWidth
        {
            get => GetOption<string?>("maxWidth");
            set => SetOption("maxWidth", value);
        }

        public string? MaxHeight
        {
            get => GetOption<string?>("maxHeight");
            set => SetOption("maxHeight", value);
        }
    }
