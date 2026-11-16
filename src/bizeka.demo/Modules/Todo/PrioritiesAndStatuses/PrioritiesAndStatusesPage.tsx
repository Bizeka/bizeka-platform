import { TaskPriorityGrid, TaskStatusGrid } from "@bizeka/todo";
import { layoutGrid, SampleInfo, samplePanel } from "../../Common/SampleInfo";

export default function pageInit() {
    SampleInfo({
        uses: ["TaskPriorityGrid", "TaskStatusGrid", "ColorHexEditor"]
    });

    const panel = samplePanel();
    for (const type of [TaskPriorityGrid, TaskStatusGrid]) {
        const section = <div class="demo-sample-section" /> as HTMLElement;
        panel.append(section);
        const grid = new type({ element: el => section.append(el) });
        layoutGrid(grid);
    }
}
