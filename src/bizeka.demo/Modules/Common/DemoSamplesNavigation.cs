using Ctrl = Bizeka.Demo.DemoSamplesPage;
using Link = Serenity.Navigation.NavigationLinkAttribute;
using Menu = Serenity.Navigation.NavigationMenuAttribute;

[assembly: Menu(7000, "Bizeka Samples", icon: "fa-magic")]
[assembly: Menu(7100, "Bizeka Samples/Editors and Formatters")]
[assembly: Link(7100, "Bizeka Samples/Editors and Formatters/Choice Editors", typeof(Ctrl), action: nameof(Ctrl.ChoiceEditors))]
[assembly: Link(7100, "Bizeka Samples/Editors and Formatters/Color Editors", typeof(Ctrl), action: nameof(Ctrl.ColorEditors))]
[assembly: Link(7100, "Bizeka Samples/Editors and Formatters/Number, Phone and Month", typeof(Ctrl), action: nameof(Ctrl.NumberPhoneAndMonth))]
[assembly: Link(7100, "Bizeka Samples/Editors and Formatters/Tags and Suggestions", typeof(Ctrl), action: nameof(Ctrl.TagsAndSuggestions))]
[assembly: Link(7100, "Bizeka Samples/Editors and Formatters/Static Text Block", typeof(Ctrl), action: nameof(Ctrl.StaticText))]
[assembly: Link(7100, "Bizeka Samples/Editors and Formatters/Grid Formatters", typeof(Ctrl), action: nameof(Ctrl.GridFormatters))]
[assembly: Menu(7200, "Bizeka Samples/JSON Dialogs")]
[assembly: Link(7200, "Bizeka Samples/JSON Dialogs/Fields from a Schema", typeof(Ctrl), action: nameof(Ctrl.SchemaFields))]
[assembly: Link(7200, "Bizeka Samples/JSON Dialogs/JSON Round Trip", typeof(Ctrl), action: nameof(Ctrl.JsonRoundTrip))]
[assembly: Menu(7300, "Bizeka Samples/Dynamic Forms")]
[assembly: Link(7300, "Bizeka Samples/Dynamic Forms/Fields on a Northwind Form", typeof(Ctrl), action: nameof(Ctrl.NorthwindCustomerFields))]
[assembly: Link(7300, "Bizeka Samples/Dynamic Forms/Form Definitions", typeof(Ctrl), action: nameof(Ctrl.FormDefinitions))]
[assembly: Menu(7400, "Bizeka Samples/Todo")]
[assembly: Link(7400, "Bizeka Samples/Todo/Task Visibility", typeof(Ctrl), action: nameof(Ctrl.TaskVisibility))]
[assembly: Link(7400, "Bizeka Samples/Todo/Priorities and Statuses", typeof(Ctrl), action: nameof(Ctrl.PrioritiesAndStatuses))]
[assembly: Menu(7500, "Bizeka Samples/Online Chat (preview)")]
[assembly: Link(7500, "Bizeka Samples/Online Chat (preview)/Chat Panel", typeof(Ctrl), action: nameof(Ctrl.ChatPanel))]
[assembly: Menu(7600, "Bizeka Samples/Theme")]
[assembly: Link(7600, "Bizeka Samples/Theme/Mode and Accent", typeof(Ctrl), action: nameof(Ctrl.ModeAndAccent))]
[assembly: Link(7600, "Bizeka Samples/Theme/Design Tokens", typeof(Ctrl), action: nameof(Ctrl.DesignTokens))]
// Root of the module screens (Bizeka Platform/Todo, /Dynamic Forms, /Online Chat); declared here as before.
[assembly: Menu(9000, "Bizeka Platform", icon: "fa-cubes")]
