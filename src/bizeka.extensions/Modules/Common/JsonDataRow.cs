using System.ComponentModel;
using Serenity.ComponentModel;
using Serenity.Data;
using Serenity.Data.Mapping;

namespace Bizeka.Extensions;

/// <summary>
/// Abstract base row implementing IJsonDataRow for persisting structured JSON data in an entity.
/// </summary>
public abstract class JsonDataRow<TFields> : Row<TFields>, IJsonDataRow
    where TFields : JsonDataRowFields, new()
{
    protected JsonDataRow()
        : base()
    {
    }

    [DisplayName("Dynamic Data Json"), Column("DynamicDataJson"), Insertable(true), Updatable(true)]
    [Localizable(true)]
    public string? DynamicDataJson
    {
        get => fields.DynamicDataJson[this];
        set => fields.DynamicDataJson[this] = value;
    }

    Field IJsonDataRow.DynamicDataJsonField => fields.DynamicDataJson;
}

public abstract class JsonDataRowFields : RowFieldsBase
{
    public StringField DynamicDataJson = null!;
}
