using System.Collections.Concurrent;

namespace Bizeka.Demo;

public class SampleSourceRequest : ServiceRequest
{
    /// <summary>Sample folder relative to Modules, for example "Editors/ChoiceEditors".</summary>
    public string? Folder { get; set; }
}

public class SampleSourceResponse : ServiceResponse
{
    public List<SampleSourceFile> Files { get; set; } = [];
}

public class SampleSourceFile
{
    public string Name { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
}

/// <summary>
/// Sample source files embedded at build time (see Bizeka.Demo.csproj). Only those resources
/// can be returned, so a request never touches the file system.
/// </summary>
public static class DemoSampleSources
{
    private const string Prefix = "SampleSource/";
    private static readonly Lazy<Dictionary<string, string>> resourceNames = new(LoadResourceNames);
    private static readonly ConcurrentDictionary<string, string> texts = new();

    /// <summary>Embedded paths relative to Modules, with forward slashes.</summary>
    public static IEnumerable<string> Paths => resourceNames.Value.Keys;

    public static List<SampleSourceFile> GetFolder(string? folder)
    {
        if (string.IsNullOrWhiteSpace(folder))
            return [];

        var prefix = folder.Trim('/') + "/";
        return [.. resourceNames.Value.Keys
            .Where(path => path.StartsWith(prefix, StringComparison.Ordinal) && IsDirectChild(path[prefix.Length..]))
            .OrderBy(path => SortOrder(path[prefix.Length..]))
            .ThenBy(path => path, StringComparer.Ordinal)
            .Select(path => new SampleSourceFile { Name = Path.GetFileName(path), Text = Read(path) })];
    }

    // Module sources a sample embeds from the module it shows (see Bizeka.Demo.csproj).
    private const string ModuleFolder = "@module/";

    private static bool IsDirectChild(string name)
    {
        if (name.StartsWith(ModuleFolder, StringComparison.Ordinal))
            name = name[ModuleFolder.Length..];
        return !name.Contains('/', StringComparison.Ordinal);
    }

    // Module sources first (server code, then client code), then the sample's entry module, then the rest.
    private static int SortOrder(string name)
    {
        if (name.StartsWith(ModuleFolder, StringComparison.Ordinal))
            return name.EndsWith(".cs", StringComparison.Ordinal) ? 0 : 1;
        if (name.EndsWith("Page.ts", StringComparison.Ordinal) || name.EndsWith("Page.tsx", StringComparison.Ordinal))
            return 2;
        return name.EndsWith(".cs", StringComparison.Ordinal) ? 3 : 4;
    }

    private static string Read(string path) => texts.GetOrAdd(path, key =>
    {
        using var stream = typeof(DemoSampleSources).Assembly.GetManifestResourceStream(resourceNames.Value[key])!;
        using var reader = new StreamReader(stream);
        return reader.ReadToEnd().ReplaceLineEndings("\n");
    });

    private static Dictionary<string, string> LoadResourceNames()
    {
        return typeof(DemoSampleSources).Assembly.GetManifestResourceNames()
            .Where(name => name.StartsWith(Prefix, StringComparison.Ordinal))
            .ToDictionary(name => name[Prefix.Length..].Replace('\\', '/'), name => name, StringComparer.Ordinal);
    }
}

[Route("Services/Demo/SampleSource/[action]"), ServiceAuthorize]
public class SampleSourceEndpoint : ServiceEndpoint
{
    [HttpPost]
    public SampleSourceResponse List(SampleSourceRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);
        return new SampleSourceResponse { Files = DemoSampleSources.GetFolder(request.Folder) };
    }
}
