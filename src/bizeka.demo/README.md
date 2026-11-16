# Bizeka.Demo

[![Serenity](https://img.shields.io/badge/Platform-Serenity-success.svg)](https://github.com/serenity-is/Serenity)

Samples for the Bizeka Platform modules on Serenity 10.6.3 and .NET 10, organised like Serenity's `Demo.BasicSamples`: one folder per sample, a shared layout, categories in the navigation and the sample's own source shown next to it.

The module adds no tables. Its only migration (`DefaultDB_20261022_1200`) inserts one example Dynamic Forms definition for the Northwind customer form; product modules ship no demo data.

## Samples

| Category | Sample | Shows |
| --- | --- | --- |
| Editors and Formatters | Choice Editors | `BooleanSwitchEditor`, `YesNoEditor`, `CheckboxButtonEditor` and what each saves |
| | Color Editors | `ColorHexEditor`, `ColorPickerEditor` |
| | Number, Phone and Month | `NumericStepperEditor`, `PhoneEditor` (single and multiple, with validation), `MonthYearEditor` |
| | Tags and Suggestions | `TagListEditor`, `AutoCompleteEditor`, `EmptyLookupEditor` filled from code |
| | Static Text Block | `StaticTextBlock`: plain, HTML (sanitized), local text and field value |
| | Grid Formatters | `ColoredColumnFormatter`, `FontColorColumnFormatter`, `YesNoColoredFormatter`, `MonthYearFormatter`, `PhoneFormatter` |
| JSON Dialogs | Fields from a Schema | `JsonDataDialog` with one field of every type, tabs, required, read-only and default values |
| | JSON Round Trip | Loading stored JSON, saving it again, dropped fields and malformed JSON |
| Dynamic Forms | Fields on a Northwind Form | `DynamicBaseDialog` on the Northwind customer form with the seeded definition and the form designer |
| | Form Definitions | The definition grid and `DynamicFieldsEditor` |
| Todo | Task Visibility | The task grid and dialog with the per-user visibility rule |
| | Priorities and Statuses | The lookup grids and the completed-status rule |
| Online Chat (preview) | Chat Panel | The embedded chat panel, its limits and preview status |
| Theme | Mode and Accent | `applyBizekaTheme`, the header toggle and a preview of standard controls |
| | Design Tokens | The `tokens.css` custom properties, read live |

## Structure

- `Modules/<Category>/<Sample>/<Sample>Page.tsx` is the entry module; forms and columns of the sample sit next to it.
- `Modules/Common/DemoSamplesPage.cs` has one action per sample at `~/Demo/<Sample>`; the action name is the sample folder name. `DemoSamplesNavigation.cs` lists the menu.
- `Areas/Bizeka.Demo/SampleLayout.cshtml` is the shared layout. `SampleInfo` renders the description and the source viewer, which reads the sample folder's files from resources embedded at build time through `Services/Demo/SampleSource/List` (signed-in users only, embedded files only).

Samples that only demonstrate client behaviour keep their data in memory and show the request a dialog would send instead of storing it. Pages of the Todo, Dynamic Forms, Online Chat and Northwind samples require the same permissions as the module screens.

## Using it in a host

Reference the package and follow the [host contract](../../docs/host-contract.md); the samples appear under **Bizeka Samples**. The Northwind sample needs `Serenity.Demo.Northwind` (Serene's demo modules).

## License

Released under the [MIT license](../../LICENSE). This is an alpha (`0.1.3-alpha`), not production-certified; see the [public gate](../../docs/release/public-gate.md).
