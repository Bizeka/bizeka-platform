# Installation checklist

- Reference Bizeka.DynamicForms and Bizeka.Extensions and load their application parts.
- Run migrations tagged DefaultDB on the Default connection.
- Register Serenity service handlers and auto-registered services for both assemblies.
- Grant DynamicForms:General for runtime definitions and DynamicForms:Manage for design changes.
- Add a JSON text column to an owner-approved consuming entity and derive its dialog from DynamicBaseDialog.
- Set the form key to a persisted definition, save and reopen the entity, and confirm custom values persist.
- Build the npm JavaScript and declaration exports before consuming the package.
- Validate dialog, designer, popup and narrow light/dark rendering in the consuming host.
