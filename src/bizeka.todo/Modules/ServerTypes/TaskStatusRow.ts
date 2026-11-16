import { fieldsProxy, getLookup, getLookupAsync } from "@serenity-is/corelib";

export interface TaskStatusRow {
    Id?: number;
    Name?: string;
    SortOrder?: number;
    Color?: string;
    IsCompleted?: boolean;
    IsActive?: boolean;
}

export abstract class TaskStatusRow {
    static readonly idProperty = 'Id';
    static readonly nameProperty = 'Name';
    static readonly localTextPrefix = 'Todo.TaskStatus';
    static readonly lookupKey = 'Todo.TaskStatus';

    /** [DEPRECATED] use getLookupAsync instead */
    static getLookup() { return getLookup<TaskStatusRow>('Todo.TaskStatus') }
    static async getLookupAsync() { return getLookupAsync<TaskStatusRow>('Todo.TaskStatus') }

    static readonly deletePermission = 'Todo:TaskStatuses:Modify';
    static readonly insertPermission = 'Todo:TaskStatuses:Modify';
    static readonly readPermission = 'Todo:TaskStatuses:View';
    static readonly updatePermission = 'Todo:TaskStatuses:Modify';

    static readonly Fields = fieldsProxy<TaskStatusRow>();
}