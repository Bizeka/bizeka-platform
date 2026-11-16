using Serenity;
using Serenity.ComponentModel;

namespace Bizeka.Extensions.Texts;

[NestedLocalTexts(Prefix = "Site.Extensions.")]
public static class ExtensionsSiteTexts
{
    public static readonly LocalText RecentColors = "Recent Colors";
    public static readonly LocalText PickColor = "Pick a color";
    public static readonly LocalText PresetColors = "Preset colors";
    public static readonly LocalText Filters = "Filters";
    public static readonly LocalText NoRecords = "No records to show";
    public static readonly LocalText Decrease = "Decrease";
    public static readonly LocalText Increase = "Increase";
    public static readonly LocalText TagListPlaceholder = "Type a value and press Enter";
    public static readonly LocalText TagListAdd = "Add";
    public static readonly LocalText GeneralTab = "General";
    public static readonly LocalText DynamicFieldsTab = "Dynamic Fields";
    public static readonly LocalText InvalidRecordJson = "{0} could not be parsed for this record.";
}
