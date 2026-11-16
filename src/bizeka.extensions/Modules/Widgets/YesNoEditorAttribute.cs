using Serenity.ComponentModel;

namespace Bizeka.Extensions;

    public partial class YesNoEditorAttribute : CustomEditorAttribute
    {
        public const string Key = "Bizeka.Extensions.YesNoEditor";

        public YesNoEditorAttribute()
            : base(Key)
        {
        }
    }
