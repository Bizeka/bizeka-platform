using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Bizeka.OnlineChat;

public static class OnlineChatServiceCollectionExtensions
{
    public static IServiceCollection AddBizekaOnlineChat(this IServiceCollection services, IConfiguration configuration)
    {
        services.TryAddScoped<AppServices.IChatAccessService, AppServices.ChatAccessService>();
        services.TryAddScoped<AppServices.IChatMessageBllService, AppServices.ChatMessageBllService>();
        services.TryAddScoped<IChatBroadcaster, ChatBroadcaster>();
        services.TryAddSingleton<OnlineChatPresenceTracker>();
        services.AddMemoryCache();
        services.TryAddSingleton<AppServices.IChatSendThrottle, AppServices.ChatSendThrottle>();
        services.Configure<OnlineChatSignalROptions>(configuration.GetSection(OnlineChatSignalROptions.SectionKey));
        var options = new OnlineChatSignalROptions();
        configuration.GetSection(OnlineChatSignalROptions.SectionKey).Bind(options);
        if (options.UseRedisBackplane)
            throw new NotSupportedException("Redis backplane is not installed.");
        services.AddSignalR(hubOptions =>
        {
            hubOptions.EnableDetailedErrors = false;
            hubOptions.MaximumReceiveMessageSize = 102400;
        });

        return services;
    }

    public static IEndpointRouteBuilder MapBizekaOnlineChatHubs(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapHub<ChatHub>("/chathub");
        return endpoints;
    }
}
