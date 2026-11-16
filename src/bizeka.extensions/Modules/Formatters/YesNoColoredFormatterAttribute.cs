using Serenity.ComponentModel;

namespace Bizeka.Extensions;

    public partial class YesNoColoredFormatterAttribute : CustomFormatterAttribute
    {
        public const string Key = "Bizeka.Extensions.YesNoColoredFormatter";

        public YesNoColoredFormatterAttribute()
            : base(Key)
        {
        }
    }
