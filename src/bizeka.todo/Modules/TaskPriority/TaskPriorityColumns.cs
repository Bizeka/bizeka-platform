namespace Bizeka.Todo;

[ColumnsScript("Todo.TaskPriority")]
[BasedOnRow(typeof(TaskPriorityRow), CheckNames = true)]
public sealed class TaskPriorityColumns
{
    [EditLink, DisplayName("Db.Shared.RecordId")]
    public int Id { get; set; }
    [EditLink]
    public string Name { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public string? Color { get; set; }
    public bool IsActive { get; set; }
}
