import { ServiceOptions, serviceRequest } from "@serenity-is/corelib";
import { SampleSourceRequest } from "./SampleSourceRequest";
import { SampleSourceResponse } from "./SampleSourceResponse";

export namespace SampleSourceService {
    export const baseUrl = 'Demo/SampleSource';

    export declare function List(request: SampleSourceRequest, onSuccess?: (response: SampleSourceResponse) => void, opt?: ServiceOptions<any>): PromiseLike<SampleSourceResponse>;

    export const Methods = {
        List: "Demo/SampleSource/List"
    } as const;

    [
        'List'
    ].forEach(x => {
        (<any>SampleSourceService)[x] = function (r, s, o) {
            return serviceRequest(baseUrl + '/' + x, r, s, o);
        };
    });
}