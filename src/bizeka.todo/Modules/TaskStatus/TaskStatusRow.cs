namespace Bizeka.Todo;

[ConnectionKey("Default"), Module("Todo"), TableName("TaskStatuses")]
[DisplayName("TaskStatuses"), InstanceName("TaskStatuses" )]
[ReadPermission(TodoPermissionKeys.TaskStatuses.View)]
[ModifyPermission(TodoPermissionKeys.TaskStatuses.Modify)]
[LookupScript("Todo.TaskStatus")]
public sealed class TaskStatusRow : Row<TaskStatusRow.RowFields>, IIdRow, INameRow
{
    [DisplayName("Id"), Identity, IdProperty]
    public int? Id
    {
        get => fields.Id[this];
        set => fields.Id[this] = value;
    }

    [DisplayName("Name"), Size(100), NotNull, QuickSearch, NameProperty]
    public string? Name
    {
        get => fields.Name[this];
        set => fields.Name[this] = value;
    }

    [DisplayName("Sort Order"), NotNull]
    public int? SortOrder
    {
        get => fields.SortOrder[this];
        set => fields.SortOrder[this] = value;
    }

    [DisplayName("Color"), Size(20)]
    public string? Color
    {
        get => fields.Color[this];
        set => fields.Color[this] = value;
    }

    [DisplayName("Is Completed"), NotNull]
    public bool? IsCompleted
    {
        get => fields.IsCompleted[this];
        set => fields.IsCompleted[this] = value;
    }

    [DisplayName("Is Active"), NotNull]
    public bool? IsActive
    {
        get => fields.IsActive[this];
        set => fields.IsActive[this] = value;
    }

    public sealed class RowFields : RowFieldsBase
    {
        public Int32Field Id = null!;
        public StringField Name = null!;
        public Int32Field SortOrder = null!;
        public StringField Color = null!;
        public BooleanField IsCompleted = null!;
        public BooleanField IsActive = null!;
    }
}
