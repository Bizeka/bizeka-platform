namespace Bizeka.Todo;

[PageAuthorize(typeof(TaskItemRow))]
public sealed class TaskItemPage : Controller
{
    [Route("Todo/TaskItem")]
    public ActionResult Index()
    {
        return View("~/Areas/Bizeka.Todo/TaskItem/TaskItemIndex.cshtml");
    }
}
