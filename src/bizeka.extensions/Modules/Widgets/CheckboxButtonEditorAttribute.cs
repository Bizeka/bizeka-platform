using Serenity.ComponentModel;
using System;

namespace Bizeka.Extensions;

    public partial class CheckboxButtonEditorAttribute : CustomEditorAttribute
    {
        public const string Key = "Bizeka.Extensions.CheckboxButtonEditor";

        public CheckboxButtonEditorAttribute()
            : base(Key)
        {
        }

        public string? EnumKey
        {
            get => GetOption<string?>("enumKey");
            set => SetOption("enumKey", value);
        }

        public Type? EnumType
        {
            get => GetOption<Type?>("enumType");
            set => SetOption("enumType", value);
        }

        public string? LookupKey
        {
            get => GetOption<string?>("lookupKey");
            set => SetOption("lookupKey", value);
        }
    }
