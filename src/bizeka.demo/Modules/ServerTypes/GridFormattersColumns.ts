import { ColoredColumnFormatter, FontColorColumnFormatter, MonthYearFormatter, PhoneFormatter, YesNoColoredFormatter } from "@bizeka/extensions";
import { ColumnsBase, fieldsProxy } from "@serenity-is/corelib";
import { Column } from "@serenity-is/sleekgrid";

export interface GridFormattersColumns {
    Project: Column;
    Stage: Column;
    Owner: Column;
    Billable: Column;
    StartMonth: Column;
    Phone: Column;
}

export class GridFormattersColumns extends ColumnsBase {
    static readonly columnsKey = 'Demo.Editors.GridFormatters';
    static readonly Fields = fieldsProxy<GridFormattersColumns>();
}

[ColoredColumnFormatter, FontColorColumnFormatter, YesNoColoredFormatter, MonthYearFormatter, PhoneFormatter]; // referenced types