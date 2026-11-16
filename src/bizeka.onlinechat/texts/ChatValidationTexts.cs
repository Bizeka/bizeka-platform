using Serenity;
using Serenity.ComponentModel;

namespace Bizeka.OnlineChat.Texts;

[NestedLocalTexts(Prefix = "Validation.OnlineChat.")]
public static class ChatValidationTexts
{
    public static readonly LocalText AccessDenied = "Chat room could not be found or accessed.";
    public static readonly LocalText InvalidMessage = "The message is invalid.";
    public static readonly LocalText TooManyMessages = "You are sending messages too quickly. Wait a moment and try again.";
}
