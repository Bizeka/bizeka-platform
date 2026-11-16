using Serenity.ComponentModel;

namespace Bizeka.Extensions;

public partial class TagListEditorAttribute : CustomEditorAttribute
{
    public const string Key = "Bizeka.Extensions.TagListEditor";

    public TagListEditorAttribute()
        : base(Key)
    {
    }

    public string? Placeholder
    {
        get => GetOption<string?>("placeholder");
        set => SetOption("placeholder", value);
    }

    public string? AddText
    {
        get => GetOption<string?>("addText");
        set => SetOption("addText", value);
    }

    public string? Delimiter
    {
        get => GetOption<string?>("delimiter");
        set => SetOption("delimiter", value);
    }
}
