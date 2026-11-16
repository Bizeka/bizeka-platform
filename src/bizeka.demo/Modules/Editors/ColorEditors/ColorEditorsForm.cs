using Bizeka.Extensions;

namespace Bizeka.Demo;

[FormScript("Demo.Editors.ColorEditors")]
public class ColorEditorsForm
{
    [DisplayName("Brand color"), ColorHexEditor, Required]
    public string? BrandColor { get; set; }

    [DisplayName("Highlight color"), ColorPickerEditor]
    public string? HighlightColor { get; set; }
}
