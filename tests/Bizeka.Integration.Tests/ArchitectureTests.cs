using System.Reflection;
using Xunit;

namespace Bizeka.Integration.Tests;

public sealed class ArchitectureTests
{
    [Fact]
    public void PlatformBoundaries()
    {
        Assembly[] assemblies = [typeof(Todo.TaskItemRow).Assembly, typeof(OnlineChat.ChatRoomRow).Assembly,
            typeof(DynamicForms.DynamicFormDefinitionRow).Assembly, typeof(Extensions.ColorHexEditorAttribute).Assembly];
        foreach (var assembly in assemblies)
        {
            Assert.DoesNotContain(assembly.GetReferencedAssemblies(), name =>
                name.Name!.EndsWith(".Pro", StringComparison.OrdinalIgnoreCase) ||
                name.Name.Contains(".SSU.", StringComparison.OrdinalIgnoreCase));
            foreach (var type in assembly.GetTypes().Where(t => t is { IsClass: true, IsAbstract: false } &&
                t.Namespace?.EndsWith(".AppServices", StringComparison.Ordinal) == true))
            {
                Assert.All(type.GetConstructors(), ctor => Assert.True(ctor.GetParameters().Length <= 4, type.FullName));
                Assert.True(type.GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly).Length <= 4,
                    type.FullName);
            }
        }
    }
}
