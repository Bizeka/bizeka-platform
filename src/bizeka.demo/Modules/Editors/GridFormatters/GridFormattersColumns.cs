using Bizeka.Extensions;

namespace Bizeka.Demo;

/// <summary>
/// Columns of the formatter sample. The color properties are not columns: the formatters read
/// them from the same item through BackgroundProperty and ColorProperty.
/// </summary>
[ColumnsScript("Demo.Editors.GridFormatters")]
public class GridFormattersColumns
{
    [DisplayName("Project"), Width(180)]
    public string? Project { get; set; }

    [DisplayName("Stage"), Width(120), ColoredColumnFormatter(BackgroundProperty = "StageColor")]
    public string? Stage { get; set; }

    [DisplayName("Owner"), Width(140), FontColorColumnFormatter(ColorProperty = "OwnerColor")]
    public string? Owner { get; set; }

    [DisplayName("Billable"), Width(90), YesNoColoredFormatter]
    public bool? Billable { get; set; }

    [DisplayName("Start"), Width(100), MonthYearFormatter]
    public string? StartMonth { get; set; }

    [DisplayName("Phone"), Width(150), PhoneFormatter]
    public string? Phone { get; set; }
}
