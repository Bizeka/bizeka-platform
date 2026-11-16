namespace Bizeka.Todo;

[ConnectionKey("Default"), Module("Todo"), TableName("TaskAssignees")]
[DisplayName("TaskAssignees"), InstanceName("TaskAssignees" )]
[ReadPermission(TodoPermissionKeys.TaskItems.View)]
[ModifyPermission(TodoPermissionKeys.TaskItems.Update)]
public sealed class TaskAssigneeRow : Row<TaskAssigneeRow.RowFields>, IIdRow
{
    [DisplayName("Id"), Identity, IdProperty]
    public int? Id
    {
        get => fields.Id[this];
        set => fields.Id[this] = value;
    }

    [DisplayName("Task Item Id"), NotNull]
    public int? TaskItemId
    {
        get => fields.TaskItemId[this];
        set => fields.TaskItemId[this] = value;
    }

    [DisplayName("User Id"), NotNull]
    public int? UserId
    {
        get => fields.UserId[this];
        set => fields.UserId[this] = value;
    }

    public sealed class RowFields : RowFieldsBase
    {
        public Int32Field Id = null!;
        public Int32Field TaskItemId = null!;
        public Int32Field UserId = null!;
    }
}
