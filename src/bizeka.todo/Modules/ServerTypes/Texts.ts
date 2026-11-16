import { proxyTexts } from "@serenity-is/corelib";

namespace texts {
    export declare namespace Db {
        export function asKey(): typeof Db;
        export function asTry(): typeof Db;
        namespace Todo {
            export function asKey(): typeof Todo;
            export function asTry(): typeof Todo;
            namespace TaskAssignee {
                export function asKey(): typeof TaskAssignee;
                export function asTry(): typeof TaskAssignee;
                export const EntityPlural: string;
                export const EntitySingular: string;
                export const Id: string;
                export const TaskItemId: string;
                export const UserId: string;
            }
            namespace TaskItem {
                export function asKey(): typeof TaskItem;
                export function asTry(): typeof TaskItem;
                export const ActualMinutes: string;
                export const AssignedByUserId: string;
                export const AssignedUserId: string;
                export const AssigneeText: string;
                export const Assignees: string;
                export const AttachmentsJson: string;
                export const Color: string;
                export const CompletedOn: string;
                export const DueDate: string;
                export const DynamicDataJson: string;
                export const EntityPlural: string;
                export const EntitySingular: string;
                export const EstimatedMinutes: string;
                export const Id: string;
                export const InsertDate: string;
                export const InsertUserId: string;
                export const IsAllDay: string;
                export const Notes: string;
                export const ReferenceNo: string;
                export const SortOrder: string;
                export const StartDate: string;
                export const StatusIsCompleted: string;
                export const Summary: string;
                export const TagsText: string;
                export const TaskPriorityColor: string;
                export const TaskPriorityId: string;
                export const TaskPriorityName: string;
                export const TaskStatusColor: string;
                export const TaskStatusId: string;
                export const TaskStatusName: string;
                export const UpdateDate: string;
                export const UpdateUserId: string;
            }
            namespace TaskPriority {
                export function asKey(): typeof TaskPriority;
                export function asTry(): typeof TaskPriority;
                export const Color: string;
                export const EntityPlural: string;
                export const EntitySingular: string;
                export const Id: string;
                export const IsActive: string;
                export const Name: string;
                export const SortOrder: string;
            }
            namespace TaskStatus {
                export function asKey(): typeof TaskStatus;
                export function asTry(): typeof TaskStatus;
                export const Color: string;
                export const EntityPlural: string;
                export const EntitySingular: string;
                export const Id: string;
                export const IsActive: string;
                export const IsCompleted: string;
                export const Name: string;
                export const SortOrder: string;
            }
        }
    }
    export declare namespace Validation {
        export function asKey(): typeof Validation;
        export function asTry(): typeof Validation;
        namespace Todo {
            export function asKey(): typeof Todo;
            export function asTry(): typeof Todo;
            export const AccessDenied: string;
            export const DateOrder: string;
            export const InvalidStatus: string;
            export const NegativeMinutes: string;
        }

    }

}

const Texts: typeof texts = proxyTexts({}, '', {
    Db: {
        Todo: {
            TaskAssignee: {},
            TaskItem: {},
            TaskPriority: {},
            TaskStatus: {}
        }
    },
    Validation: {
        Todo: {}
    }
}) as any;

export const TodoDbTexts = Texts.Db.Todo;
export const TodoValidationTexts = Texts.Validation.Todo;