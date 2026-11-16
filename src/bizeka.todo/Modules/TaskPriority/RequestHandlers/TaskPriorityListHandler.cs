namespace Bizeka.Todo;

public sealed class TaskPriorityListHandler : ListRequestHandlerAsync<TaskPriorityRow>
{
    public TaskPriorityListHandler(IRequestContext context) : base(context)
    {
    }
}
