namespace Bizeka.DynamicForms;

/// <summary>
/// Form schemas for dynamic-field dialogs. Any authenticated user may read it on purpose: dialogs of other
/// modules (for example Todo tasks) render these fields for users who do not hold DynamicForms permissions.
/// It exposes only the form key and field schema, never record data, and only active definitions.
/// </summary>
[LookupScript("DynamicForms.DynamicFormDefinition", Permission = "?")]
public sealed class DynamicFormDefinitionLookup : RowLookupScript<DynamicFormDefinitionRow>
{
    public DynamicFormDefinitionLookup(ISqlConnections sqlConnections)
        : base(sqlConnections)
    {
    }

    protected override void PrepareQuery(SqlQuery query)
    {
        base.PrepareQuery(query);
        // A boolean parameter, not 1: PostgreSQL rejects comparing a boolean column with an integer.
        query.Where(new Criteria(DynamicFormDefinitionRow.Fields.IsActive) == new ValueCriteria(true));
    }
}
