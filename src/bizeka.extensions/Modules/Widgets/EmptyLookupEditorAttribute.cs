using Serenity.ComponentModel;

namespace Bizeka.Extensions;

    public partial class EmptyLookupEditorAttribute : CustomEditorAttribute
    {
        public const string Key = "Bizeka.Extensions.EmptyLookupEditor";

        public EmptyLookupEditorAttribute()
            : base(Key)
        {
        }
    }
