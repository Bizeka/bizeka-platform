namespace Bizeka.Todo;

[ColumnsScript("Todo.TaskStatus")]
[BasedOnRow(typeof(TaskStatusRow), CheckNames = true)]
public sealed class TaskStatusColumns
{
    [EditLink, DisplayName("Db.Shared.RecordId")]
    public int Id { get; set; }
    [EditLink]
    public string Name { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public string? Color { get; set; }
    public bool IsCompleted { get; set; }
    public bool IsActive { get; set; }
}
