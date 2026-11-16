using Microsoft.AspNetCore.Mvc.ApplicationParts;
using Microsoft.Extensions.DependencyInjection;

namespace Bizeka.Theme;

public static class ThemeServiceCollectionExtensions
{
    /// <summary>
    /// Registers this assembly as an MVC application part, so Serenity's type source
    /// finds the theme's local texts (the header menu labels) like any other module.
    /// The theme has no controllers, so MVC would not discover it on its own.
    /// </summary>
    public static IServiceCollection AddBizekaTheme(this IServiceCollection services)
    {
        var assembly = typeof(ThemeServiceCollectionExtensions).Assembly;
        services.AddMvcCore().ConfigureApplicationPartManager(manager =>
        {
            if (!manager.ApplicationParts.OfType<AssemblyPart>().Any(x => x.Assembly == assembly))
                manager.ApplicationParts.Add(new AssemblyPart(assembly));
        });
        return services;
    }
}
