import { DynamicFormDefinitionGrid } from "@bizeka/dynamicforms";
import { layoutGrid, SampleInfo, samplePanel } from "../../Common/SampleInfo";

export default function pageInit() {
    SampleInfo({
        uses: ["DynamicFormDefinitionGrid", "DynamicFieldsEditor", "DynamicFormDefinition lookup"]
    });

    const grid = new DynamicFormDefinitionGrid({ element: el => samplePanel().append(el) });
    layoutGrid(grid);
}
