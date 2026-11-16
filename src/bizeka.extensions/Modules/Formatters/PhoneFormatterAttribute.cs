using Serenity.ComponentModel;

namespace Bizeka.Extensions;

public partial class PhoneFormatterAttribute : CustomFormatterAttribute
{
    public const string Key = "Bizeka.Extensions.PhoneFormatter";

    public PhoneFormatterAttribute()
        : base(Key)
    {
    }
}
