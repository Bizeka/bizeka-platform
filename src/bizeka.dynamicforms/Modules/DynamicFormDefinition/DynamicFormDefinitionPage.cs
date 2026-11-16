namespace Bizeka.DynamicForms;

[PageAuthorize(typeof(DynamicFormDefinitionRow))]
public class DynamicFormDefinitionPage : Controller
{
    [Route("DynamicForms/DynamicFormDefinition")]
    public ActionResult Index()
    {
        return View("~/Areas/Bizeka.DynamicForms/DynamicFormDefinition/DynamicFormDefinitionIndex.cshtml");
    }
}
