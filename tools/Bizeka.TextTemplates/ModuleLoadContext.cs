using System.Reflection;
using System.Runtime.Loader;

/// <summary>
/// Loads a module assembly and its private dependencies from the module's build output.
/// Assemblies the tool ships itself (Serenity, the framework) come from the default context,
/// so the Serenity types used to read the module stay shared.
/// </summary>
sealed class ModuleLoadContext(string modulePath) : AssemblyLoadContext(isCollectible: false)
{
    private readonly string moduleDirectory = Path.GetDirectoryName(modulePath)!;
    private readonly string toolDirectory = AppContext.BaseDirectory;

    protected override Assembly? Load(AssemblyName name)
    {
        var file = name.Name + ".dll";
        if (File.Exists(Path.Combine(toolDirectory, file)))
            return null;

        var path = Path.Combine(moduleDirectory, file);
        return File.Exists(path) ? LoadFromAssemblyPath(path) : null;
    }
}
