namespace Bizeka.Todo;

public sealed class TaskStatusSaveHandler : SaveRequestHandlerAsync<TaskStatusRow>
{
    public TaskStatusSaveHandler(IRequestContext context) : base(context)
    {
    }
}
