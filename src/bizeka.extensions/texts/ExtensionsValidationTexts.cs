using Serenity;
using Serenity.ComponentModel;

namespace Bizeka.Extensions;

[NestedLocalTexts(Prefix = "Validation.Bizeka.")]
public static class ExtensionsValidationTexts
{
    public static readonly LocalText Phone = "Phone numbers should be entered in format '(503) 555-9831'.";
    public static readonly LocalText PhoneMultiple = "Phone numbers should be entered in format '(503) 555-9831'. Multiple numbers can be separated with comma.";
}
