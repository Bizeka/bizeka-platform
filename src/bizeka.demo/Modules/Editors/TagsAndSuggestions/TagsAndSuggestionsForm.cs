using Bizeka.Extensions;

namespace Bizeka.Demo;

[FormScript("Demo.Editors.TagsAndSuggestions")]
public class TagsAndSuggestionsForm
{
    [DisplayName("Labels"), TagListEditor]
    public List<string>? Labels { get; set; }

    [DisplayName("City"), AutoCompleteEditor]
    [EditorOption("sourceCSV", "Amsterdam,Ankara,Berlin,Istanbul,Izmir,Lisbon,Madrid,Vienna")]
    public string? City { get; set; }

    [DisplayName("Sales region"), EmptyLookupEditor]
    public string? SalesRegion { get; set; }
}
