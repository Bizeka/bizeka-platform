using System.Reflection;
using Bizeka.Demo;
using Microsoft.AspNetCore.Mvc;
using Serenity.Navigation;
using Xunit;

namespace Bizeka.Integration.Tests;

public sealed class DemoSampleCatalogTests
{
    [Fact]
    public void EverySampleLinkHasAnActionAndEmbeddedSource()
    {
        // A sample is a navigation link, an action named after its folder and a <Sample>Page module in
        // that folder; the embedded source is what the sample page shows next to it.
        var assembly = typeof(DemoSamplesPage).Assembly;
        var actions = typeof(DemoSamplesPage).GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly)
            .Where(m => m.ReturnType == typeof(ActionResult)).Select(m => m.Name).ToHashSet();
        var links = assembly.GetCustomAttributes<NavigationLinkAttribute>()
            .Select(x => x.Url ?? "").Where(x => x.StartsWith("~/Demo/", StringComparison.Ordinal)).Select(x => x["~/Demo/".Length..]).ToList();

        Assert.Equal(actions.Order(), links.Order());
        foreach (var sample in actions)
        {
            var page = Assert.Single(DemoSampleSources.Paths,
                x => x.EndsWith($"/{sample}/{sample}Page.ts", StringComparison.Ordinal) ||
                    x.EndsWith($"/{sample}/{sample}Page.tsx", StringComparison.Ordinal));
            var files = DemoSampleSources.GetFolder(page[..page.LastIndexOf('/')]);
            Assert.Contains(files, x => x.Name == Path.GetFileName(page));
        }
        Assert.Empty(DemoSampleSources.GetFolder("../Common"));
    }

    [Fact]
    public void ChatSampleShowsTheModuleSourcesBeforeThePage()
    {
        // The chat sample page is three lines of setup; the hub, the client connection and the host
        // wiring are what a reader looks for.
        var names = DemoSampleSources.GetFolder("OnlineChat/ChatPanel").Select(x => x.Name).ToList();
        Assert.Equal(["ChatHub.cs", "OnlineChatServiceCollectionExtensions.cs", "ChatConnection.ts", "ChatPanelPage.tsx"], names);
    }
}
