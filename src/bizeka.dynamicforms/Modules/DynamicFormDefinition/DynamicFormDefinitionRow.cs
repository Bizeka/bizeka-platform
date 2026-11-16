namespace Bizeka.DynamicForms;

[ConnectionKey("Default"), Module("DynamicForms"), TableName("DynamicFormDefinitions")]
[DisplayName("DynamicFormDefinitions"), InstanceName("DynamicFormDefinitions" )]
[ReadPermission(DynamicFormsPermissionKeys.General)]
[ModifyPermission(DynamicFormsPermissionKeys.Manage)]
[DeletePermission(DynamicFormsPermissionKeys.Manage)]
[LookupScript(typeof(DynamicFormDefinitionLookup))]
public sealed class DynamicFormDefinitionRow : Row<DynamicFormDefinitionRow.RowFields>, IIdRow, INameRow
{
    [DisplayName("Id"), Identity, IdProperty]
    public int? Id { get => fields.Id[this]; set => fields.Id[this] = value; }

    [DisplayName("Form Key"), Size(150), NotNull, QuickSearch, NameProperty]
    [LookupInclude]
    public string? FormKey { get => fields.FormKey[this]; set => fields.FormKey[this] = value; }

    [DisplayName("Definition Json")]
    [LookupInclude]
    public string? DefinitionJson { get => fields.DefinitionJson[this]; set => fields.DefinitionJson[this] = value; }

    [DisplayName("Description"), Size(500)]
    public string? Description { get => fields.Description[this]; set => fields.Description[this] = value; }

    [DisplayName("Active"), NotNull]
    public bool? IsActive { get => fields.IsActive[this]; set => fields.IsActive[this] = value; }

    public class RowFields : RowFieldsBase
    {
        public Int32Field Id = null!;
        public StringField FormKey = null!;
        public StringField DefinitionJson = null!;
        public StringField Description = null!;
        public BooleanField IsActive = null!;
    }
}
