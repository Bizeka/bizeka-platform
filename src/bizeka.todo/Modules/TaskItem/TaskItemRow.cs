namespace Bizeka.Todo;

[ConnectionKey("Default"), Module("Todo"), TableName("TaskItems")]
[DisplayName("TaskItems"), InstanceName("TaskItems" )]
[ReadPermission(TodoPermissionKeys.TaskItems.View)]
[InsertPermission(TodoPermissionKeys.TaskItems.Create)]
[UpdatePermission(TodoPermissionKeys.TaskItems.Update)]
[DeletePermission(TodoPermissionKeys.TaskItems.Delete)]
public sealed class TaskItemRow : Row<TaskItemRow.RowFields>, IIdRow, INameRow
    , IInsertLogRow, IUpdateLogRow
{
    [DisplayName("Id"), Identity, IdProperty]
    public int? Id
    {
        get => fields.Id[this];
        set => fields.Id[this] = value;
    }

    [DisplayName("Summary"), Size(200), NotNull, NameProperty]
    public string? Summary
    {
        get => fields.Summary[this];
        set => fields.Summary[this] = value;
    }

    [DisplayName("Legacy Assignee Text"), Size(100), Insertable(false), Updatable(false)]
    public string? AssigneeText
    {
        get => fields.AssigneeText[this];
        set => fields.AssigneeText[this] = value;
    }

    [DisplayName("Legacy Assigned User"), LookupEditor("Administration.User"), Insertable(false), Updatable(false)]
    public int? AssignedUserId
    {
        get => fields.AssignedUserId[this];
        set => fields.AssignedUserId[this] = value;
    }

    [DisplayName("Assigned By"), LookupEditor("Administration.User"), Updatable(false)]
    public int? AssignedByUserId
    {
        get => fields.AssignedByUserId[this];
        set => fields.AssignedByUserId[this] = value;
    }

    [DisplayName("Assignees"), AsyncLookupEditor("Administration.User", Multiple = true), NotMapped]
    [LinkingSetRelation(typeof(TaskAssigneeRow), nameof(TaskAssigneeRow.TaskItemId), nameof(TaskAssigneeRow.UserId))]
    [MinSelectLevel(SelectLevel.Details)]
    public List<int> Assignees
    {
        get => fields.Assignees[this] ?? [];
        set => fields.Assignees[this] = value;
    }

    [DisplayName("Reference No"), Size(50)]
    public string? ReferenceNo
    {
        get => fields.ReferenceNo[this];
        set => fields.ReferenceNo[this] = value;
    }

    [DisplayName("Tags"), Size(500)]
    public string? TagsText
    {
        get => fields.TagsText[this];
        set => fields.TagsText[this] = value;
    }

    [DisplayName("Sort Order"), NotNull, Insertable(false), Updatable(false)]
    public int? SortOrder
    {
        get => fields.SortOrder[this];
        set => fields.SortOrder[this] = value;
    }

    [DisplayName("Priority"), ForeignKey("TaskPriorities", "Id"), LeftJoin("jPriority"), TextualField(nameof(TaskPriorityName))]
    [LookupEditor(typeof(TaskPriorityRow))]
    public int? TaskPriorityId
    {
        get => fields.TaskPriorityId[this];
        set => fields.TaskPriorityId[this] = value;
    }

    [DisplayName("Status"), NotNull, ForeignKey("TaskStatuses", "Id"), LeftJoin("jStatus"), TextualField(nameof(TaskStatusName))]
    [LookupEditor(typeof(TaskStatusRow))]
    public int? TaskStatusId
    {
        get => fields.TaskStatusId[this];
        set => fields.TaskStatusId[this] = value;
    }

    [DisplayName("Start Date")]
    public DateTime? StartDate
    {
        get => fields.StartDate[this];
        set => fields.StartDate[this] = value;
    }

    [DisplayName("Due Date")]
    public DateTime? DueDate
    {
        get => fields.DueDate[this];
        set => fields.DueDate[this] = value;
    }

    [DisplayName("All Day")]
    public bool? IsAllDay
    {
        get => fields.IsAllDay[this];
        set => fields.IsAllDay[this] = value;
    }

    [DisplayName("Completed On")]
    public DateTime? CompletedOn
    {
        get => fields.CompletedOn[this];
        set => fields.CompletedOn[this] = value;
    }

    [DisplayName("Estimated Minutes")]
    public int? EstimatedMinutes
    {
        get => fields.EstimatedMinutes[this];
        set => fields.EstimatedMinutes[this] = value;
    }

    [DisplayName("Actual Minutes")]
    public int? ActualMinutes
    {
        get => fields.ActualMinutes[this];
        set => fields.ActualMinutes[this] = value;
    }

    [DisplayName("Notes"), Size(int.MaxValue)]
    public string? Notes
    {
        get => fields.Notes[this];
        set => fields.Notes[this] = value;
    }

    [DisplayName("Color"), Size(20)]
    public string? Color
    {
        get => fields.Color[this];
        set => fields.Color[this] = value;
    }

    [DisplayName("Attachments"), Size(int.MaxValue)]
    public string? AttachmentsJson
    {
        get => fields.AttachmentsJson[this];
        set => fields.AttachmentsJson[this] = value;
    }

    [Insertable(false), Updatable(false)]
    [DisplayName("Insert User Id")]
    public int? InsertUserId
    {
        get => fields.InsertUserId[this];
        set => fields.InsertUserId[this] = value;
    }

    [Insertable(false), Updatable(false)]
    [DisplayName("Insert Date")]
    public DateTime? InsertDate
    {
        get => fields.InsertDate[this];
        set => fields.InsertDate[this] = value;
    }

    [Insertable(false), Updatable(false)]
    [DisplayName("Update User Id")]
    public int? UpdateUserId
    {
        get => fields.UpdateUserId[this];
        set => fields.UpdateUserId[this] = value;
    }

    [Insertable(false), Updatable(false)]
    [DisplayName("Update Date")]
    public DateTime? UpdateDate
    {
        get => fields.UpdateDate[this];
        set => fields.UpdateDate[this] = value;
    }

    [DisplayName("Priority"), Expression("jPriority.[Name]")]
    public string? TaskPriorityName
    {
        get => fields.TaskPriorityName[this];
        set => fields.TaskPriorityName[this] = value;
    }

    [DisplayName("Priority Color"), Expression("jPriority.[Color]")]
    public string? TaskPriorityColor
    {
        get => fields.TaskPriorityColor[this];
        set => fields.TaskPriorityColor[this] = value;
    }

    [DisplayName("Status"), Expression("jStatus.[Name]")]
    public string? TaskStatusName
    {
        get => fields.TaskStatusName[this];
        set => fields.TaskStatusName[this] = value;
    }

    [DisplayName("Status Color"), Expression("jStatus.[Color]")]
    public string? TaskStatusColor
    {
        get => fields.TaskStatusColor[this];
        set => fields.TaskStatusColor[this] = value;
    }

    [DisplayName("Completed"), Expression("jStatus.[IsCompleted]")]
    public bool? StatusIsCompleted
    {
        get => fields.StatusIsCompleted[this];
        set => fields.StatusIsCompleted[this] = value;
    }

    Field IInsertUserIdRow.InsertUserIdField => fields.InsertUserId;
    DateTimeField IInsertDateRow.InsertDateField => fields.InsertDate;
    Field IUpdateUserIdRow.UpdateUserIdField => fields.UpdateUserId;
    DateTimeField IUpdateDateRow.UpdateDateField => fields.UpdateDate;

    [DisplayName("Dynamic Data Json")]
    public string? DynamicDataJson { get => fields.DynamicDataJson[this]; set => fields.DynamicDataJson[this] = value; }

    public sealed class RowFields : RowFieldsBase
    {
        public Int32Field Id = null!;
        public StringField Summary = null!;
        public StringField AssigneeText = null!;
        public Int32Field AssignedUserId = null!;
        public Int32Field AssignedByUserId = null!;
        public ListField<int> Assignees = null!;
        public StringField ReferenceNo = null!;
        public StringField TagsText = null!;
        public Int32Field SortOrder = null!;
        public Int32Field TaskPriorityId = null!;
        public Int32Field TaskStatusId = null!;
        public DateTimeField StartDate = null!;
        public DateTimeField DueDate = null!;
        public BooleanField IsAllDay = null!;
        public DateTimeField CompletedOn = null!;
        public Int32Field EstimatedMinutes = null!;
        public Int32Field ActualMinutes = null!;
        public StringField Notes = null!;
        public StringField Color = null!;
        public StringField AttachmentsJson = null!;
        public Int32Field InsertUserId = null!;
        public DateTimeField InsertDate = null!;
        public Int32Field UpdateUserId = null!;
        public DateTimeField UpdateDate = null!;

        public StringField TaskPriorityName = null!;
        public StringField TaskPriorityColor = null!;
        public StringField TaskStatusName = null!;
        public StringField TaskStatusColor = null!;
        public BooleanField StatusIsCompleted = null!;
        public StringField DynamicDataJson = null!;
    }
}
