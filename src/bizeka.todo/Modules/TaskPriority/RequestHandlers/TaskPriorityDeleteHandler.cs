namespace Bizeka.Todo;

public sealed class TaskPriorityDeleteHandler : DeleteRequestHandlerAsync<TaskPriorityRow>
{
    public TaskPriorityDeleteHandler(IRequestContext context) : base(context)
    {
    }
}
