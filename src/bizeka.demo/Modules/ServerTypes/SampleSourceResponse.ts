import { ServiceResponse } from "@serenity-is/corelib";
import { SampleSourceFile } from "./SampleSourceFile";

export interface SampleSourceResponse extends ServiceResponse {
    Files?: SampleSourceFile[];
}