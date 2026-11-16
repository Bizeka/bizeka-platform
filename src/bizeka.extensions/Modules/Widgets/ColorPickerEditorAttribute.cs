using Serenity.ComponentModel;

namespace Bizeka.Extensions;

    public partial class ColorPickerEditorAttribute : CustomEditorAttribute
    {
        public const string Key = "Bizeka.Extensions.ColorPickerEditor";

        public ColorPickerEditorAttribute()
            : base(Key)
        {
        }
    }
