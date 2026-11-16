using Bizeka.Extensions;

namespace Bizeka.Todo;

[FormScript("Todo.TaskPriority")]
[BasedOnRow(typeof(TaskPriorityRow), CheckNames = true)]
public sealed class TaskPriorityForm
{
    public string Name { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    [ColorHexEditor]
    public string? Color { get; set; }
    public bool IsActive { get; set; }
}
