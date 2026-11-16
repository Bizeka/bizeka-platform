import { fieldsProxy } from "@serenity-is/corelib";

export interface TaskItemRow {
    Id?: number;
    Summary?: string;
    AssigneeText?: string;
    AssignedUserId?: number;
    AssignedByUserId?: number;
    Assignees?: number[];
    ReferenceNo?: string;
    TagsText?: string;
    SortOrder?: number;
    TaskPriorityId?: number;
    TaskStatusId?: number;
    StartDate?: string;
    DueDate?: string;
    IsAllDay?: boolean;
    CompletedOn?: string;
    EstimatedMinutes?: number;
    ActualMinutes?: number;
    Notes?: string;
    Color?: string;
    AttachmentsJson?: string;
    InsertUserId?: number;
    InsertDate?: string;
    UpdateUserId?: number;
    UpdateDate?: string;
    TaskPriorityName?: string;
    TaskPriorityColor?: string;
    TaskStatusName?: string;
    TaskStatusColor?: string;
    StatusIsCompleted?: boolean;
    DynamicDataJson?: string;
}

export abstract class TaskItemRow {
    static readonly idProperty = 'Id';
    static readonly nameProperty = 'Summary';
    static readonly localTextPrefix = 'Todo.TaskItem';
    static readonly deletePermission = 'Todo:TaskItems:Delete';
    static readonly insertPermission = 'Todo:TaskItems:Create';
    static readonly readPermission = 'Todo:TaskItems:View';
    static readonly updatePermission = 'Todo:TaskItems:Update';

    static readonly Fields = fieldsProxy<TaskItemRow>();
}