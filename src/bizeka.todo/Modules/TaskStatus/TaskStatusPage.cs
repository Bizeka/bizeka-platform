namespace Bizeka.Todo;

[PageAuthorize(typeof(TaskStatusRow))]
public sealed class TaskStatusPage : Controller
{
    [Route("Todo/TaskStatus")]
    public ActionResult Index()
    {
        return View("~/Areas/Bizeka.Todo/TaskStatus/TaskStatusIndex.cshtml");
    }
}
