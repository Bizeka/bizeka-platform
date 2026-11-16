using System.Text;
using System.Text.Json;
using Serenity.Abstractions;
using Serenity.Data;
using Serenity.Localization;

if (args.Length < 2) throw new ArgumentException("Supply assembly path and output path, optionally --check.");
// Assembly.LoadFrom would return a copy with the same identity from this tool's own output;
// an isolated context always reads the module as it was just built.
var modulePath = Path.GetFullPath(args[0]);
var assembly = new ModuleLoadContext(modulePath).LoadFromAssemblyPath(modulePath);
var source = new DefaultTypeSource([assembly]);
var registry = new LocalTextRegistry();
registry.AddNestedTexts(source);
registry.AddEnumTexts(source);
registry.AddNavigationTexts(source);
registry.AddNestedPermissions(source);
registry.AddPropertyItemsTexts(source);
var rows = assembly.GetTypes().Where(t => !t.IsAbstract && !t.ContainsGenericParameters && typeof(IRow).IsAssignableFrom(t))
    .Select(t => (IRow)Activator.CreateInstance(t)!);
registry.AddRowTexts(rows);
var texts = registry.GetAllAvailableTextsInLanguage("", pending: false).OrderBy(x => x.Key, StringComparer.Ordinal)
    .ToDictionary(x => x.Key, x => x.Value);
var output = JsonSerializer.Serialize(texts, new JsonSerializerOptions { WriteIndented = true,
    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping }).Replace("\r\n", "\n") + "\n";
var path = Path.GetFullPath(args[1]);
if (args.Contains("--check"))
{
    if (!File.Exists(path) || File.ReadAllText(path).Replace("\r\n", "\n") != output)
        throw new InvalidOperationException("Generated text template differs: " + Path.GetFileName(path));
}
else File.WriteAllText(path, output, new UTF8Encoding(false));
Console.WriteLine($"{assembly.GetName().Name}: {texts.Count} generated local texts.");
