namespace Bizeka.Todo;

public sealed class TaskPriorityRetrieveHandler : RetrieveRequestHandlerAsync<TaskPriorityRow>
{
    public TaskPriorityRetrieveHandler(IRequestContext context) : base(context)
    {
    }
}
