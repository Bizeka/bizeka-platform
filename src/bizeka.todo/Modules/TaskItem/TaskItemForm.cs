using Bizeka.Extensions;

namespace Bizeka.Todo;

[FormScript("Todo.TaskItem")]
[BasedOnRow(typeof(TaskItemRow), CheckNames = true)]
public sealed class TaskItemForm
{
    public string Summary { get; set; } = string.Empty;
    [LookupEditor("Administration.User")]
    [System.ComponentModel.ReadOnly(true)]
    public int? AssignedByUserId { get; set; }
    [AsyncLookupEditor("Administration.User", Multiple = true)]
    public List<int>? Assignees { get; set; }
    public string? ReferenceNo { get; set; }
    public string? TagsText { get; set; }
    [System.ComponentModel.ReadOnly(true)]
    public int SortOrder { get; set; }
    public int? TaskPriorityId { get; set; }
    public int TaskStatusId { get; set; }
    [DateTimeEditor]
    public DateTime? StartDate { get; set; }
    [DateTimeEditor]
    public DateTime? DueDate { get; set; }
    [DisplayName("All Day")]
    public bool IsAllDay { get; set; }
    [DateEditor]
    public DateTime? CompletedOn { get; set; }
    public int? EstimatedMinutes { get; set; }
    public int? ActualMinutes { get; set; }
    [TextAreaEditor(Rows = 6)]
    public string? Notes { get; set; }
    [ColorHexEditor]
    public string? Color { get; set; }
}
