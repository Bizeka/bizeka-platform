namespace Bizeka.Demo;

[NestedLocalTexts(Prefix = "Site.Demo.")]
public static class DemoSiteTexts
{
    public static class ChatPanel
    {
        public static readonly LocalText Intro = "<p>The chat panel of the OnlineChat module; messages and presence arrive through the SignalR hub at <code>/chathub</code>. <b>Preview:</b> text only, 30 messages per minute per user by default, one application instance, no tenant boundary. Open it as a second user to see live updates.</p>";
    }

    public static class ChoiceEditors
    {
        public static readonly LocalText Intro = "<p>Three ways to ask a yes/no or pick-several question, each chosen by an attribute on the C# form property. Press <b>Read Values</b> to see what each one saves.</p>";
    }

    public static class ColorEditors
    {
        public static readonly LocalText Intro = "<p>Both editors store a color as a <code>#rrggbb</code> string, which fits an <code>nvarchar(7)</code> column and works directly in CSS.</p>";
        public static readonly LocalText PreviewOfTheChosenColors = "Preview of the chosen colors";
    }

    public static class Common
    {
        public static readonly LocalText AboutThisSample = "About this sample";
        public static readonly LocalText BuiltOn = "Built on: ";
        public static readonly LocalText NotStoredThisSampleOnlyShows = "Not stored: this sample only shows the request.";
        public static readonly LocalText ReadValues = "Read Values";
        public static readonly LocalText SaveRequestSentToTheService = "Save request sent to the service";
        public static readonly LocalText SavedEntity = "Saved entity";
        public static readonly LocalText SourceFiles = "Source files";
    }

    public static class DesignTokens
    {
        public static readonly LocalText Accent = "Accent";
        public static readonly LocalText Intro = "<p>Every color, radius and shadow of the theme comes from these custom properties, shown with their live values. A module matches the theme with a Bootstrap fallback, for example <code>var(--bizeka-surface, var(--bs-body-bg))</code>.</p>";
        public static readonly LocalText NoTokenMatchesThisSearch = "No token matches this search.";
        public static readonly LocalText SearchTokens = "Search tokens";
        public static readonly LocalText Shape = "Shape";
        public static readonly LocalText Surfaces = "Surfaces";
        public static readonly LocalText TextAndBorders = "Text and borders";
        public static readonly LocalText TokenGroups = "Token groups";
    }

    public static class FormDefinitions
    {
        public static readonly LocalText Intro = "<p>Each dynamic form is one row: a form key, a JSON array of field definitions and an active flag. Dialogs read active definitions through a lookup that holds schemas, never record data. Editing needs <code>DynamicForms:Manage</code>.</p>";
    }

    public static class GridFormatters
    {
        public static readonly LocalText Billable = "Billable";
        public static readonly LocalText CustomerPortal = "Customer portal";
        public static readonly LocalText Done = "Done";
        public static readonly LocalText InProgress = "In progress";
        public static readonly LocalText InternalWiki = "Internal wiki";
        public static readonly LocalText Intro = "<p>Formatters are attached with attributes on a C# columns class, like Serenity's own. The two color formatters read the color from another property of the same row. This grid is filled from memory; with a real service the columns class is the same.</p>";
        public static readonly LocalText InvoiceExport = "Invoice export";
        public static readonly LocalText No = "No";
        public static readonly LocalText OnHold = "On hold";
        public static readonly LocalText Owner = "Owner";
        public static readonly LocalText Planning = "Planning";
        public static readonly LocalText Stage = "Stage";
        public static readonly LocalText WarehouseScanners = "Warehouse scanners";
        public static readonly LocalText Yes = "Yes";
    }

    public static class JsonRoundTrip
    {
        public static readonly LocalText AutumnMeetup = "Autumn meetup";
        public static readonly LocalText Capacity = "Capacity";
        public static readonly LocalText HarbourHall = "Harbour Hall";
        public static readonly LocalText Intro = "<p>A stored record brings its extra values inside <code>DynamicDataJson</code>; the dialog spreads them into the schema fields and saving packs them again. <code>RetiredField</code> is no longer in the schema, so the next save drops it. Malformed JSON opens with a warning instead of failing.</p>";
        public static readonly LocalText LoadMalformedJSON = "Load malformed JSON";
        public static readonly LocalText LoadedARecordWhoseJSONCannot = "Loaded a record whose JSON cannot be parsed.";
        public static readonly LocalText Outdoor = "Outdoor";
        public static readonly LocalText PlatformTeam = "Platform team";
        public static readonly LocalText ReloadStoredRecord = "Reload stored record";
        public static readonly LocalText Venue = "Venue";
    }

    public static class ModeAndAccent
    {
        public static readonly LocalText Accent = "Accent";
        public static readonly LocalText Accent2 = "Accent";
        public static readonly LocalText Amber = "Amber";
        public static readonly LocalText AnInformationMessageOnTheCurrent = "An information message on the current surface.";
        public static readonly LocalText Badge = "Badge";
        public static readonly LocalText Crimson = "Crimson";
        public static readonly LocalText CurrentTheme = "Current theme";
        public static readonly LocalText Dark = "Dark";
        public static readonly LocalText Default = "default";
        public static readonly LocalText FollowTheSystem = "Follow the system";
        public static readonly LocalText Indigo = "Indigo";
        public static readonly LocalText Intro = "<p>A CSS layer over Serenity's styles, driven by two attributes on the root element and one custom property; Serenity's markup does not change. Pick a mode and an accent, or use the menu in the header that <code>initBizekaTheme</code> adds, then open any other page.</p>";
        public static readonly LocalText Light = "Light";
        public static readonly LocalText Mode = "Mode";
        public static readonly LocalText Now = "now";
        public static readonly LocalText Outline = "Outline";
        public static readonly LocalText Preview = "Preview";
        public static readonly LocalText Primary = "Primary";
        public static readonly LocalText RemoveTheTheme = "Remove the theme";
        public static readonly LocalText Select = "Select";
        public static readonly LocalText Teal = "Teal";
        public static readonly LocalText TextInput = "Text input";
        public static readonly LocalText TheThemeIsRemovedSerenityS = "The theme is removed; Serenity's default styles apply. Pick a mode to bring it back.";
    }

    public static class NorthwindCustomerFields
    {
        public static readonly LocalText Intro = "<p>The Northwind customer form with extra fields nobody wrote code for: they come from the definition <code>Northwind.Customer.OpenSource</code> and appear on the <i>Bizeka OSS</i> tab. Change them with <b>Form Design</b>. Northwind has no JSON column, so this sample shows the save request.</p>";
        public static readonly LocalText NotStoredTheRequestIsShown = "Not stored: the request is shown below the form.";
        public static readonly LocalText SaveRequestNotSent = "Save request (not sent)";
    }

    public static class NumberPhoneAndMonth
    {
        public static readonly LocalText Intro = "<p>Editors for values a plain text box gets wrong: the stepper keeps its range, the phone editor validates (<code>Multiple = true</code> accepts a list) and the month editor saves <code>yyyy-MM</code>. Type an invalid phone number and press <b>Read Values</b>.</p>";
    }

    public static class PrioritiesAndStatuses
    {
        public static readonly LocalText Intro = "<p>Ordinary lookup tables with a color and a sort order, edited with the module's grids. A status marked as completed makes the server fill the task's <i>Completed On</i> date.</p>";
    }

    public static class SchemaFields
    {
        public static readonly LocalText Agenda = "Agenda";
        public static readonly LocalText Capacity = "Capacity";
        public static readonly LocalText Details = "Details";
        public static readonly LocalText DoorsOpen = "Doors open";
        public static readonly LocalText EventDate = "Event date";
        public static readonly LocalText Intro = "<p><code>JsonDataDialog</code> adds fields described by a schema to an entity dialog. Press <b>Apply Changes</b>: form fields stay top-level, schema fields are collected into the <code>DynamicDataJson</code> string of a <code>JsonDataRow</code>.</p>";
        public static readonly LocalText OneLinePerSession = "One line per session";
        public static readonly LocalText Outdoor = "Outdoor";
        public static readonly LocalText Reference = "Reference";
        public static readonly LocalText Schedule = "Schedule";
        public static readonly LocalText TicketPrice = "Ticket price";
        public static readonly LocalText Venue = "Venue";
    }

    public static class StaticText
    {
        public static readonly LocalText Checklist = "<ol class='mb-0'><li>Describe the change</li><li>Name an owner</li><li>Pick a date</li></ol>";
        public static readonly LocalText HoverMe = "Hover me.";
        public static readonly LocalText Instructions = "Fill in the request below. Fields marked with an asterisk are required.";
        public static readonly LocalText Intro = "<p>Read-only text between editors: a local text, a short HTML fragment or the value of the field. HTML goes through the corelib sanitizer: the <i>Reviewer note</i> below holds a <code>&lt;script&gt;</code> tag and an <code>onmouseover</code> handler, and neither runs.</p>";
        public static readonly LocalText LooksGood = "Looks <b>good</b>.";
    }

    public static class TagsAndSuggestions
    {
        public static readonly LocalText Central = "Central";
        public static readonly LocalText Intro = "<p><code>TagListEditor</code> saves a string array, <code>AutoCompleteEditor</code> suggests values but accepts any text, and <code>EmptyLookupEditor</code> is filled from code, for items that depend on another field.</p>";
        public static readonly LocalText North = "North";
        public static readonly LocalText Priority = "priority";
        public static readonly LocalText Renewal = "renewal";
        public static readonly LocalText South = "South";
    }

    public static class TaskVisibility
    {
        public static readonly LocalText Intro = "<p>The real Todo grid. You see a task when you created it, assigned it or are an assignee, and the same rule filters list, retrieve, update and delete on the server (<code>TaskVisibility.CriteriaFor</code>). Try it with two users.</p>";
    }
}
