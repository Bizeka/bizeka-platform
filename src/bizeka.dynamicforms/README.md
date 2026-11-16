# Bizeka.DynamicForms

[![Serenity](https://img.shields.io/badge/Platform-Serenity-success.svg)](https://github.com/serenity-is/Serenity)

Open source Serenity feature module for runtime dynamic fields. This project is part of the **Bizeka Platform** and is an MIT-licensed alpha release ([license](../../LICENSE)).

`Bizeka.DynamicForms` lets a Serenity form gain new fields without changing the underlying entity table schema beyond a single JSON storage column such as `DynamicDataJson`.

## Product Position

This package is the community-ready core.

It is intentionally focused on:

- dynamic form definition management
- runtime field injection into Serenity dialogs
- JSON-based value persistence
- reusable base dialog and field designer infrastructure
- simple, stable field metadata that is easy to maintain

It does not try to carry every advanced enterprise feature. Richer editors, field-level permissions, operator hints and advanced validation policies are outside the scope of this module.


## Current Open Source Scope

Supported field types:

- `String`
- `Integer`
- `Decimal`
- `Date`
- `DateTime`
- `Boolean`
- `TextArea`

Supported metadata:

- `Required`, `MaxLength`, `MinValue`, `MaxValue`
- `DecimalDigits`, `TextRows`, `Placeholder`
- `DefaultValue`, `ReadOnly`, `Tab`

## Architecture

The module has two responsibilities:

1. **Definition authoring:** A dynamic form definition record stores `FormKey` plus `DefinitionJson`.
2. **Runtime rendering:** A dialog derived from `DynamicBaseDialog` reads the definition for its `FormKey`, converts field metadata into Serenity `PropertyItem` entries, and persists values into `DynamicDataJson`.

## Minimal Backend Integration

Your target row needs a JSON storage field:

```csharp
[TextAreaEditor, Hidden]
public string DynamicDataJson { get; set; }
```

Your dialog should inherit from `DynamicBaseDialog`:

```ts
import { DynamicBaseDialog } from "@bizeka/dynamicforms";

export class MyEntityDialog extends DynamicBaseDialog<any, any> {
    static override [Symbol.typeInfo] = this.registerClass("MyProject.MyModule.");
    // Implementation details...
}
```

## Integration in a Serene 10.6.3 Host

The package commands below describe the intended package names. NuGet/npm packages coming soon; until then, use the locally built NuGet feed and npm tarballs. Restore Serenity framework packages through the host before installing the module. See the [repository setup](../../README.md).

### 1. Install Packages
**NuGet (Backend):**
```bash
dotnet add package Bizeka.DynamicForms
```

**NPM (Frontend):**
```bash
npm install @bizeka/dynamicforms
```

### 2. Dependency Injection and Configuration

In your `Startup.cs` or `Program.cs`, you don't need heavy DI for Dynamic Forms (it primarily uses the database and JSON serialization). However, ensure its controllers and UI components are discovered.

### 3. Database Migrations

`Bizeka.DynamicForms` requires the `DynamicFormDefinitions` table. Make sure to run its FluentMigrator migrations by registering the assembly:

```csharp
// In your FluentMigrator runner configuration:
.ScanIn(typeof(Bizeka.DynamicForms.DynamicFormDefinitionRow).Assembly).For.Migrations()
```

## Contributing & License

Released under the [MIT license](../../LICENSE). This is an alpha (`0.1.3-alpha`), not production-certified; see the [public gate](../../docs/release/public-gate.md).
For contribution guidelines, code of conduct, and reporting issues, please refer to the root `bizeka-platform` repository documentation.

TR: Bu modül özel ön sürümdür. Kurulum ve yayın koşulları için kök README ve release kontrol listesini izleyin.
