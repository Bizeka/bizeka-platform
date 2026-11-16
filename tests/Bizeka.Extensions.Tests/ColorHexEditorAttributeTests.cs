using Xunit;
using Serenity.ComponentModel;
using Bizeka.Extensions;

namespace Bizeka.Extensions.Tests;

public class ColorHexEditorAttributeTests
{
    [Fact]
    public void Constructor_SetsKeyProperly()
    {
        // Act
        var attr = new ColorHexEditorAttribute();

        // Assert
        Assert.Equal("Bizeka.Extensions.ColorHexEditor", attr.EditorType);
    }
}
