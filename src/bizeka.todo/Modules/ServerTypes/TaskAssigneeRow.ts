import { fieldsProxy } from "@serenity-is/corelib";

export interface TaskAssigneeRow {
    Id?: number;
    TaskItemId?: number;
    UserId?: number;
}

export abstract class TaskAssigneeRow {
    static readonly idProperty = 'Id';
    static readonly localTextPrefix = 'Todo.TaskAssignee';
    static readonly deletePermission = 'Todo:TaskItems:Update';
    static readonly insertPermission = 'Todo:TaskItems:Update';
    static readonly readPermission = 'Todo:TaskItems:View';
    static readonly updatePermission = 'Todo:TaskItems:Update';

    static readonly Fields = fieldsProxy<TaskAssigneeRow>();
}