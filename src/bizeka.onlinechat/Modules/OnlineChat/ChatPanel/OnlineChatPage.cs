using Microsoft.AspNetCore.Mvc;
using Serenity.Web;

namespace Bizeka.OnlineChat;

[Route("OnlineChat")]
[PageAuthorize("OnlineChat:General")]
public class OnlineChatPage : Controller
{
    [HttpGet]
    public ActionResult Index()
    {
        return View("~/Areas/Bizeka.OnlineChat/OnlineChatIndex.cshtml");
    }
}
