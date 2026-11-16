import { ColorHexEditor } from "@bizeka/extensions";
import { gridPageInit } from "@serenity-is/corelib";
import { TaskItemGrid } from "./TaskItemGrid";

void ColorHexEditor;

export default function () {
    gridPageInit(TaskItemGrid);
}
