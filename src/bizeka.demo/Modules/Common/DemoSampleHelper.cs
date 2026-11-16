using Microsoft.Extensions.DependencyInjection;
using System.Runtime.CompilerServices;

namespace Bizeka.Demo;

/// <summary>
/// Sample categories. Each value is a folder under Modules; a sample lives in
/// Modules/&lt;Category&gt;/&lt;Sample&gt; and its entry module is &lt;Sample&gt;Page.ts(x).
/// </summary>
public static class DemoCategory
{
    public const string Editors = "Editors";
    public const string JsonDialogs = "JsonDialogs";
    public const string DynamicForms = "DynamicForms";
    public const string Todo = "Todo";
    public const string OnlineChat = "OnlineChat";
    public const string Theme = "Theme";

    public static string GetTitle(string category) => category switch
    {
        Editors => "Editors and Formatters",
        JsonDialogs => "JSON Dialogs",
        DynamicForms => "Dynamic Forms",
        Todo => "Todo",
        OnlineChat => "Online Chat (preview)",
        Theme => "Theme",
        _ => category
    };
}

public static class DemoSampleHelper
{
    public const string LayoutPath = "~/Areas/Bizeka.Demo/SampleLayout.cshtml";
    public const string FolderKey = "DemoSampleFolder";
    public const string CategoryKey = "DemoSampleCategory";

    /// <summary>
    /// Renders the sample named after the calling action inside the shared sample layout.
    /// </summary>
    public static ModulePageResult SamplePage(this Controller controller, string category, string title,
        object? options = null, [CallerMemberName] string sample = "")
    {
        ArgumentNullException.ThrowIfNull(controller);

        var folder = category + "/" + sample;
        controller.ViewData[FolderKey] = folder;
        // The menu already translates these, so the heading and the menu always agree.
        var localizer = controller.HttpContext.RequestServices.GetRequiredService<ITextLocalizer>();
        var categoryTitle = DemoCategory.GetTitle(category);
        var categoryPath = "Navigation.Bizeka Samples/" + categoryTitle;
        controller.ViewData[CategoryKey] = localizer.TryGet(categoryPath) ?? categoryTitle;

        return controller.PanelPage(new ModulePageModel
        {
            Module = $"~/_content/Bizeka.Demo/esm/Modules/{folder}/{sample}Page.js",
            PageTitle = localizer.TryGet(categoryPath + "/" + title) ?? title,
            Options = options,
            Layout = LayoutPath
        });
    }
}
