using Serenity.ComponentModel;

namespace Bizeka.Extensions;

public partial class NumericStepperEditorAttribute : CustomEditorAttribute
{
    public const string Key = "Bizeka.Extensions.NumericStepperEditor";

    public NumericStepperEditorAttribute()
        : base(Key)
    {
    }

    public double Min
    {
        get => GetOption<double>("min");
        set => SetOption("min", value);
    }

    public double Max
    {
        get => GetOption<double>("max");
        set => SetOption("max", value);
    }

    public double Step
    {
        get => GetOption<double>("step");
        set => SetOption("step", value);
    }
}
