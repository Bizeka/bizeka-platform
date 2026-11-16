namespace Bizeka.Todo;

[PageAuthorize(typeof(TaskPriorityRow))]
public sealed class TaskPriorityPage : Controller
{
    [Route("Todo/TaskPriority")]
    public ActionResult Index()
    {
        return View("~/Areas/Bizeka.Todo/TaskPriority/TaskPriorityIndex.cshtml");
    }
}
