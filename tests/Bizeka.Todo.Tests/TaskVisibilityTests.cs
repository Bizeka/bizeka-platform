using System.Security.Claims;
using Bizeka.Todo;

namespace Bizeka.Todo.Tests;

public sealed class TaskVisibilityTests
{
    [Fact]
    public void UnauthenticatedClaimsDenied()
    {
        var user = new ClaimsPrincipal(new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier, "42")]));
        Assert.Null(TaskVisibility.TryGetUserId(user));
    }

    [Theory]
    [InlineData("42", 42)]
    [InlineData("0", null)]
    [InlineData("-1", null)]
    [InlineData("bad", null)]
    public void IdentifierMustBePositive(string id, int? expected)
    {
        var user = new ClaimsPrincipal(new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier, id)], "Test"));
        Assert.Equal(expected, TaskVisibility.TryGetUserId(user));
    }
}
