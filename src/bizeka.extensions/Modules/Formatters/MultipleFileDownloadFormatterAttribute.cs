using Serenity.ComponentModel;

namespace Bizeka.Extensions;

    public partial class MultipleFileDownloadFormatterAttribute : CustomFormatterAttribute
    {
        public const string Key = "Bizeka.Extensions.MultipleFileDownloadFormatter";

        public MultipleFileDownloadFormatterAttribute()
            : base(Key)
        {
        }

        public string? DisplayFormat
        {
            get => GetOption<string?>("displayFormat");
            set => SetOption("displayFormat", value);
        }
    }
