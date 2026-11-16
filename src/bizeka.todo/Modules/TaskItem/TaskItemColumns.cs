namespace Bizeka.Todo;

[ColumnsScript("Todo.TaskItem")]
[BasedOnRow(typeof(TaskItemRow), CheckNames = true)]
public sealed class TaskItemColumns
{
    [EditLink, DisplayName("Db.Shared.RecordId")]
    public int Id { get; set; }
    [EditLink]
    public string Summary { get; set; } = string.Empty;

    public string? ReferenceNo { get; set; }
    [QuickFilter]
    public string? TaskPriorityName { get; set; }
    [QuickFilter]
    public string? TaskStatusName { get; set; }
    public int? SortOrder { get; set; }
    public DateTime? StartDate { get; set; }
    [QuickFilter]
    public DateTime? DueDate { get; set; }
    public DateTime? CompletedOn { get; set; }
}
