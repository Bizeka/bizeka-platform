import { ServiceRequest } from "@serenity-is/corelib";

export interface SampleSourceRequest extends ServiceRequest {
    Folder?: string;
}