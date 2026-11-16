using Bizeka.Extensions;

namespace Bizeka.Demo;

[FormScript("Demo.Editors.NumberPhoneAndMonth")]
public class NumberPhoneAndMonthForm
{
    [DisplayName("Seats"), NumericStepperEditor(Min = 1, Max = 25, Step = 1)]
    public int? Seats { get; set; }

    [DisplayName("Office phone"), PhoneEditor]
    public string? OfficePhone { get; set; }

    [DisplayName("Other phones"), PhoneEditor(Multiple = true)]
    public string? OtherPhones { get; set; }

    [DisplayName("Contract start"), MonthYearEditor]
    public string? ContractStart { get; set; }
}
