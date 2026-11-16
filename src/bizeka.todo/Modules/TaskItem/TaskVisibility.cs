using System.Security.Claims;

namespace Bizeka.Todo;

public static class TaskVisibility
{
    public static int? TryGetUserId(ClaimsPrincipal? user)
    {
        if (user?.Identity?.IsAuthenticated != true) return null;
        return int.TryParse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var id) && id > 0 ? id : null;
    }

    public static BaseCriteria CriteriaFor(int? userId)
    {
        var f = TaskItemRow.Fields;
        if (userId is null) return f.Id == -1;
        // Criteria.Exists(ISqlQuery) embeds SQL but does not merge a separate query's parameters.
        // Only a validated integer is embedded here; user text is never accepted as SQL.
        var members = Criteria.Exists("SELECT 1 FROM [TaskAssignees] ta WHERE ta.[TaskItemId] = T0.[Id] AND ta.[UserId] = " +
            userId.Value.ToString(System.Globalization.CultureInfo.InvariantCulture));
        return f.InsertUserId == userId.Value | f.AssignedByUserId == userId.Value | members;
    }
}
