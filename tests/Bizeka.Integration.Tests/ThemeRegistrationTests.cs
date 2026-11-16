using Bizeka.Theme;
using Microsoft.AspNetCore.Mvc.ApplicationParts;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace Bizeka.Integration.Tests;

public sealed class ThemeRegistrationTests
{
    [Fact]
    public void AddBizekaThemeMakesTheThemeAnApplicationPartOnce()
    {
        // The theme has no controllers, so MVC did not list it as an application part and
        // Serenity never registered its local texts (the header menu labels).
        var services = new ServiceCollection();
        services.AddBizekaTheme();
        services.AddBizekaTheme();

        var manager = (ApplicationPartManager)services
            .Last(x => x.ServiceType == typeof(ApplicationPartManager)).ImplementationInstance!;
        var assembly = typeof(ThemeServiceCollectionExtensions).Assembly;
        Assert.Single(manager.ApplicationParts, x => x is AssemblyPart part && part.Assembly == assembly);
    }
}
