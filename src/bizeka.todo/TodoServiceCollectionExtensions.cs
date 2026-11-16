using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Bizeka.Todo.AppServices;

namespace Bizeka.Todo;

public static class TodoServiceCollectionExtensions
{
    public static IServiceCollection AddBizekaTodo(this IServiceCollection services)
    {
        services.TryAddScoped<ITaskItemBllService, TaskItemBllService>();
        return services;
    }
}
