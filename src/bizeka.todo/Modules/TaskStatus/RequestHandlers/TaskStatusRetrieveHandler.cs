namespace Bizeka.Todo;

public sealed class TaskStatusRetrieveHandler : RetrieveRequestHandlerAsync<TaskStatusRow>
{
    public TaskStatusRetrieveHandler(IRequestContext context) : base(context)
    {
    }
}
