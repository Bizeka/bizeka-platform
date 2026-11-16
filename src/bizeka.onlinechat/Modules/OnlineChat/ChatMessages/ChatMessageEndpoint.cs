using Microsoft.AspNetCore.Mvc;
using Serenity.Data;
using Serenity.Services;
using System.Data;
using MyRow = Bizeka.OnlineChat.ChatMessageRow;

namespace Bizeka.OnlineChat.Endpoints;

[Route("Services/OnlineChat/ChatMessage/[action]")]
[ConnectionKey(typeof(MyRow)), ServiceAuthorize(typeof(MyRow))]
public class ChatMessageEndpoint : ServiceEndpoint
{
    [HttpPost, AuthorizeCreate(typeof(MyRow))]
    public async Task<SaveResponse> Create(IDbConnection connection, SaveRequest<MyRow> request,
        [FromServices] IChatMessageSaveHandler handler,
        [FromServices] Bizeka.OnlineChat.AppServices.IChatMessageBllService rules,
        CancellationToken cancellationToken = default)
    {
        using var uow = new UnitOfWork(connection);
        var response = await handler.CreateAsync(uow, request, cancellationToken).ConfigureAwait(false);
        uow.Commit();
        await rules.NotifyAsync(uow.Connection, Convert.ToInt64(response.EntityId), cancellationToken).ConfigureAwait(false);
        return response;
    }

    [HttpPost, AuthorizeUpdate(typeof(MyRow))]
    public Task<SaveResponse> Update(IUnitOfWork uow, SaveRequest<MyRow> request,
        [FromServices] IChatMessageSaveHandler handler, CancellationToken cancellationToken = default)
    {
        return handler.UpdateAsync(uow, request, cancellationToken);
    }

    [HttpPost, AuthorizeDelete(typeof(MyRow))]
    public Task<DeleteResponse> Delete(IUnitOfWork uow, DeleteRequest request,
        [FromServices] IChatMessageDeleteHandler handler, CancellationToken cancellationToken = default)
    {
        return handler.DeleteAsync(uow, request, cancellationToken);
    }

    [HttpPost]
    public Task<RetrieveResponse<MyRow>> Retrieve(IDbConnection connection, RetrieveRequest request,
        [FromServices] IChatMessageRetrieveHandler handler, CancellationToken cancellationToken = default)
    {
        return handler.RetrieveAsync(connection, request, cancellationToken);
    }

    [HttpPost, AuthorizeList(typeof(MyRow))]
    public Task<ListResponse<MyRow>> List(IDbConnection connection, ListRequest request,
        [FromServices] IChatMessageListHandler handler, CancellationToken cancellationToken = default)
    {
        return handler.ListAsync(connection, request, cancellationToken);
    }
}
