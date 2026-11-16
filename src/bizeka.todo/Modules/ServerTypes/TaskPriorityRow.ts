import { fieldsProxy, getLookup, getLookupAsync } from "@serenity-is/corelib";

export interface TaskPriorityRow {
    Id?: number;
    Name?: string;
    SortOrder?: number;
    Color?: string;
    IsActive?: boolean;
}

export abstract class TaskPriorityRow {
    static readonly idProperty = 'Id';
    static readonly nameProperty = 'Name';
    static readonly localTextPrefix = 'Todo.TaskPriority';
    static readonly lookupKey = 'Todo.TaskPriority';

    /** [DEPRECATED] use getLookupAsync instead */
    static getLookup() { return getLookup<TaskPriorityRow>('Todo.TaskPriority') }
    static async getLookupAsync() { return getLookupAsync<TaskPriorityRow>('Todo.TaskPriority') }

    static readonly deletePermission = 'Todo:TaskPriorities:Modify';
    static readonly insertPermission = 'Todo:TaskPriorities:Modify';
    static readonly readPermission = 'Todo:TaskPriorities:View';
    static readonly updatePermission = 'Todo:TaskPriorities:Modify';

    static readonly Fields = fieldsProxy<TaskPriorityRow>();
}