using Bizeka.Extensions;

namespace Bizeka.DynamicForms;

/// <summary>
/// Forwarding interface for backward compatibility. Now inherits from Bizeka.Extensions.IJsonDataRow.
/// </summary>
public interface IDynamicDataRow : IJsonDataRow
{
}
