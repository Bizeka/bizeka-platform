using Serenity.ComponentModel;

namespace Bizeka.Extensions;

    public partial class MonthYearEditorAttribute : CustomEditorAttribute
    {
        public const string Key = "Bizeka.Extensions.MonthYearEditor";

        public MonthYearEditorAttribute()
            : base(Key)
        {
        }
    }
