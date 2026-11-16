namespace Bizeka.Todo;

[NestedPermissionKeys]
[DisplayName("Todo")]
public sealed class TodoPermissionKeys
{
    [DisplayName("Task Items")]
    public sealed class TaskItems
    {
        public const string View = "Todo:TaskItems:View";
        public const string Create = "Todo:TaskItems:Create";
        public const string Update = "Todo:TaskItems:Update";
        public const string Delete = "Todo:TaskItems:Delete";
    }

    [DisplayName("Task Priorities")]
    public sealed class TaskPriorities
    {
        public const string View = "Todo:TaskPriorities:View";
        public const string Modify = "Todo:TaskPriorities:Modify";
    }

    [DisplayName("Task Statuses")]
    public sealed class TaskStatuses
    {
        public const string View = "Todo:TaskStatuses:View";
        public const string Modify = "Todo:TaskStatuses:Modify";
    }
}
