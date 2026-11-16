using Serenity.Data;

namespace Bizeka.Extensions;

/// <summary>
/// Defines a contract for entities that persist arbitrary dynamic or custom attributes as a JSON payload.
/// </summary>
public interface IJsonDataRow
{
    string? DynamicDataJson { get; set; }
    Field DynamicDataJsonField { get; }
}
