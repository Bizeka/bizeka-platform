using Serenity;

namespace Bizeka.Todo.Texts;

[NestedLocalTexts(Prefix = "Validation.Todo.")]
public static class TodoValidationTexts
{
    public static readonly LocalText DateOrder = "Due date cannot be earlier than start date.";
    public static readonly LocalText NegativeMinutes = "Minutes cannot be negative.";
    public static readonly LocalText AccessDenied = "Task could not be found or accessed.";
    public static readonly LocalText InvalidStatus = "Select a valid task status.";
}
