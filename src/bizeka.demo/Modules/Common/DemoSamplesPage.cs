using Bizeka.DynamicForms;
using Bizeka.Todo;

namespace Bizeka.Demo;

/// <summary>
/// One action per sample. The action name is the sample folder name, see <see cref="DemoSampleHelper"/>.
/// </summary>
[PageAuthorize, Route("Demo/[action]")]
public class DemoSamplesPage : Controller
{
    public ActionResult ChoiceEditors() => this.SamplePage(DemoCategory.Editors, "Choice Editors");

    public ActionResult ColorEditors() => this.SamplePage(DemoCategory.Editors, "Color Editors");

    public ActionResult NumberPhoneAndMonth() => this.SamplePage(DemoCategory.Editors, "Number, Phone and Month");

    public ActionResult TagsAndSuggestions() => this.SamplePage(DemoCategory.Editors, "Tags and Suggestions");

    public ActionResult StaticText() => this.SamplePage(DemoCategory.Editors, "Static Text Block");

    public ActionResult GridFormatters() => this.SamplePage(DemoCategory.Editors, "Grid Formatters");

    public ActionResult SchemaFields() => this.SamplePage(DemoCategory.JsonDialogs, "Fields from a Schema");

    public ActionResult JsonRoundTrip() => this.SamplePage(DemoCategory.JsonDialogs, "JSON Round Trip");

    [PageAuthorize("Northwind:Customer:View")]
    public ActionResult NorthwindCustomerFields() => this.SamplePage(DemoCategory.DynamicForms, "Fields on a Northwind Form");

    [PageAuthorize(DynamicFormsPermissionKeys.General)]
    public ActionResult FormDefinitions() => this.SamplePage(DemoCategory.DynamicForms, "Form Definitions");

    [PageAuthorize(TodoPermissionKeys.TaskItems.View)]
    public ActionResult TaskVisibility() => this.SamplePage(DemoCategory.Todo, "Task Visibility");

    [PageAuthorize(TodoPermissionKeys.TaskStatuses.View)]
    public ActionResult PrioritiesAndStatuses() => this.SamplePage(DemoCategory.Todo, "Priorities and Statuses");

    [PageAuthorize("OnlineChat:General")]
    public ActionResult ChatPanel() => this.SamplePage(DemoCategory.OnlineChat, "Chat Panel");

    public ActionResult ModeAndAccent() => this.SamplePage(DemoCategory.Theme, "Mode and Accent");

    public ActionResult DesignTokens() => this.SamplePage(DemoCategory.Theme, "Design Tokens");
}
