using Serenity.Services;

namespace Bizeka.OnlineChat;

public interface IChatRoomSaveHandler : ISaveHandlerAsync<ChatRoomRow> { }

[RegisterScoped(typeof(IChatRoomSaveHandler))]
public class ChatRoomSaveHandler(IRequestContext context)
    : SaveRequestHandlerAsync<ChatRoomRow>(context), IChatRoomSaveHandler
{
    protected override async Task BeforeSaveAsync(CancellationToken cancellationToken = default)
    {
        if (!IsCreate && Old.InsertUserId?.ToString(System.Globalization.CultureInfo.InvariantCulture) != User.GetIdentifier())
            throw new ValidationError(Bizeka.OnlineChat.Texts.ChatValidationTexts.AccessDenied.Key);
        await base.BeforeSaveAsync(cancellationToken).ConfigureAwait(false);
    }
}
