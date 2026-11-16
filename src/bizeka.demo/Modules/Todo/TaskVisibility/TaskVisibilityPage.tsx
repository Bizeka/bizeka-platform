import { TaskItemGrid } from "@bizeka/todo";
import { addGridFilterToggle } from "@bizeka/extensions";
import { layoutGrid, SampleInfo, samplePanel } from "../../Common/SampleInfo";

export default function pageInit() {
    SampleInfo({
        uses: ["TaskItemGrid", "TaskItemDialog", "TaskVisibility", "DynamicBaseDialog", "addGridFilterToggle"]
    });

    const grid = new TaskItemGrid({ element: el => samplePanel().append(el) });
    layoutGrid(grid);
    addGridFilterToggle(grid.domNode);
}
