using Bizeka.Extensions;

namespace Bizeka.DynamicForms;

/// <summary>
/// Forwarding class for backward compatibility. Now inherits from Bizeka.Extensions.JsonDataRow.
/// </summary>
public abstract class DynamicDataRow<TFields> : JsonDataRow<TFields>, IDynamicDataRow
    where TFields : DynamicDataRowFields, new()
{
    protected DynamicDataRow()
        : base()
    {
    }
}

public abstract class DynamicDataRowFields : JsonDataRowFields
{
}
