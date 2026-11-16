namespace Bizeka.Todo;

public sealed class TaskStatusDeleteHandler : DeleteRequestHandlerAsync<TaskStatusRow>
{
    public TaskStatusDeleteHandler(IRequestContext context) : base(context)
    {
    }
}
