using Serenity.ComponentModel;

namespace Bizeka.Extensions;

    public partial class MonthYearFormatterAttribute : CustomFormatterAttribute
    {
        public const string Key = "Bizeka.Extensions.MonthYearFormatter";

        public MonthYearFormatterAttribute()
            : base(Key)
        {
        }
    }
