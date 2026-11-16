using Serenity.ComponentModel;

namespace Bizeka.Extensions;

    public partial class PhoneEditorAttribute : CustomEditorAttribute
    {
        public const string Key = "Bizeka.Extensions.PhoneEditor";

        public PhoneEditorAttribute()
            : base(Key)
        {
        }

        public bool Multiple
        {
            get { return GetOption<bool>("multiple"); }
            set { SetOption("multiple", value); }
        }
    }
