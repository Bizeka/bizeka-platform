using Bizeka.Extensions;

namespace Bizeka.Todo;

[FormScript("Todo.TaskStatus")]
[BasedOnRow(typeof(TaskStatusRow), CheckNames = true)]
public sealed class TaskStatusForm
{
    public string Name { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    [ColorHexEditor]
    public string? Color { get; set; }
    public bool IsCompleted { get; set; }
    public bool IsActive { get; set; }
}
