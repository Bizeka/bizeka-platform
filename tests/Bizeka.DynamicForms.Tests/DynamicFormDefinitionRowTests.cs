using Xunit;
using Serenity.Data;
using Bizeka.DynamicForms;
using Serenity.Data.Mapping;
using System.Reflection;

namespace Bizeka.DynamicForms.Tests;

public class DynamicFormDefinitionRowTests
{
    [Fact]
    public void DynamicFormDefinitionRow_HasCorrectConnectionKeyAndTableName()
    {
        // Act
        var rowType = typeof(DynamicFormDefinitionRow);
        
        // Assert
        var connectionKeyAttr = rowType.GetCustomAttribute<ConnectionKeyAttribute>();
        Assert.NotNull(connectionKeyAttr);
        Assert.Equal("Default", connectionKeyAttr.Value);

        var tableNameAttr = rowType.GetCustomAttribute<TableNameAttribute>();
        Assert.NotNull(tableNameAttr);
        Assert.Equal("DynamicFormDefinitions", tableNameAttr.Name);
    }
}
