namespace Bizeka.Todo;

public sealed class TaskStatusListHandler : ListRequestHandlerAsync<TaskStatusRow>
{
    public TaskStatusListHandler(IRequestContext context) : base(context)
    {
    }
}
