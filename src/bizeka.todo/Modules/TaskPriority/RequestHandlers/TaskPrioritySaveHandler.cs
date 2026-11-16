namespace Bizeka.Todo;

public sealed class TaskPrioritySaveHandler : SaveRequestHandlerAsync<TaskPriorityRow>
{
    public TaskPrioritySaveHandler(IRequestContext context) : base(context)
    {
    }
}
