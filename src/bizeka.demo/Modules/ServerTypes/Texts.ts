import { proxyTexts } from "@serenity-is/corelib";

namespace texts {
    export declare namespace Site {
        export function asKey(): typeof Site;
        export function asTry(): typeof Site;
        namespace Demo {
            export function asKey(): typeof Demo;
            export function asTry(): typeof Demo;
            namespace ChatPanel {
                export function asKey(): typeof ChatPanel;
                export function asTry(): typeof ChatPanel;
                export const Intro: string;
            }
            namespace ChoiceEditors {
                export function asKey(): typeof ChoiceEditors;
                export function asTry(): typeof ChoiceEditors;
                export const Intro: string;
            }
            namespace ColorEditors {
                export function asKey(): typeof ColorEditors;
                export function asTry(): typeof ColorEditors;
                export const Intro: string;
                export const PreviewOfTheChosenColors: string;
            }
            namespace Common {
                export function asKey(): typeof Common;
                export function asTry(): typeof Common;
                export const AboutThisSample: string;
                export const BuiltOn: string;
                export const NotStoredThisSampleOnlyShows: string;
                export const ReadValues: string;
                export const SaveRequestSentToTheService: string;
                export const SavedEntity: string;
                export const SourceFiles: string;
            }
            namespace DesignTokens {
                export function asKey(): typeof DesignTokens;
                export function asTry(): typeof DesignTokens;
                export const Accent: string;
                export const Intro: string;
                export const NoTokenMatchesThisSearch: string;
                export const SearchTokens: string;
                export const Shape: string;
                export const Surfaces: string;
                export const TextAndBorders: string;
                export const TokenGroups: string;
            }
            namespace FormDefinitions {
                export function asKey(): typeof FormDefinitions;
                export function asTry(): typeof FormDefinitions;
                export const Intro: string;
            }
            namespace GridFormatters {
                export function asKey(): typeof GridFormatters;
                export function asTry(): typeof GridFormatters;
                export const Billable: string;
                export const CustomerPortal: string;
                export const Done: string;
                export const InProgress: string;
                export const InternalWiki: string;
                export const Intro: string;
                export const InvoiceExport: string;
                export const No: string;
                export const OnHold: string;
                export const Owner: string;
                export const Planning: string;
                export const Stage: string;
                export const WarehouseScanners: string;
                export const Yes: string;
            }
            namespace JsonRoundTrip {
                export function asKey(): typeof JsonRoundTrip;
                export function asTry(): typeof JsonRoundTrip;
                export const AutumnMeetup: string;
                export const Capacity: string;
                export const HarbourHall: string;
                export const Intro: string;
                export const LoadMalformedJSON: string;
                export const LoadedARecordWhoseJSONCannot: string;
                export const Outdoor: string;
                export const PlatformTeam: string;
                export const ReloadStoredRecord: string;
                export const Venue: string;
            }
            namespace ModeAndAccent {
                export function asKey(): typeof ModeAndAccent;
                export function asTry(): typeof ModeAndAccent;
                export const Accent: string;
                export const Accent2: string;
                export const Amber: string;
                export const AnInformationMessageOnTheCurrent: string;
                export const Badge: string;
                export const Crimson: string;
                export const CurrentTheme: string;
                export const Dark: string;
                export const Default: string;
                export const FollowTheSystem: string;
                export const Indigo: string;
                export const Intro: string;
                export const Light: string;
                export const Mode: string;
                export const Now: string;
                export const Outline: string;
                export const Preview: string;
                export const Primary: string;
                export const RemoveTheTheme: string;
                export const Select: string;
                export const Teal: string;
                export const TextInput: string;
                export const TheThemeIsRemovedSerenityS: string;
            }
            namespace NorthwindCustomerFields {
                export function asKey(): typeof NorthwindCustomerFields;
                export function asTry(): typeof NorthwindCustomerFields;
                export const Intro: string;
                export const NotStoredTheRequestIsShown: string;
                export const SaveRequestNotSent: string;
            }
            namespace NumberPhoneAndMonth {
                export function asKey(): typeof NumberPhoneAndMonth;
                export function asTry(): typeof NumberPhoneAndMonth;
                export const Intro: string;
            }
            namespace PrioritiesAndStatuses {
                export function asKey(): typeof PrioritiesAndStatuses;
                export function asTry(): typeof PrioritiesAndStatuses;
                export const Intro: string;
            }
            namespace SchemaFields {
                export function asKey(): typeof SchemaFields;
                export function asTry(): typeof SchemaFields;
                export const Agenda: string;
                export const Capacity: string;
                export const Details: string;
                export const DoorsOpen: string;
                export const EventDate: string;
                export const Intro: string;
                export const OneLinePerSession: string;
                export const Outdoor: string;
                export const Reference: string;
                export const Schedule: string;
                export const TicketPrice: string;
                export const Venue: string;
            }
            namespace StaticText {
                export function asKey(): typeof StaticText;
                export function asTry(): typeof StaticText;
                export const Checklist: string;
                export const HoverMe: string;
                export const Instructions: string;
                export const Intro: string;
                export const LooksGood: string;
            }
            namespace TagsAndSuggestions {
                export function asKey(): typeof TagsAndSuggestions;
                export function asTry(): typeof TagsAndSuggestions;
                export const Central: string;
                export const Intro: string;
                export const North: string;
                export const Priority: string;
                export const Renewal: string;
                export const South: string;
            }
            namespace TaskVisibility {
                export function asKey(): typeof TaskVisibility;
                export function asTry(): typeof TaskVisibility;
                export const Intro: string;
            }

        }

    }

}

const Texts: typeof texts = proxyTexts({}, '', {
    Site: {
        Demo: {
            ChatPanel: {},
            ChoiceEditors: {},
            ColorEditors: {},
            Common: {},
            DesignTokens: {},
            FormDefinitions: {},
            GridFormatters: {},
            JsonRoundTrip: {},
            ModeAndAccent: {},
            NorthwindCustomerFields: {},
            NumberPhoneAndMonth: {},
            PrioritiesAndStatuses: {},
            SchemaFields: {},
            StaticText: {},
            TagsAndSuggestions: {},
            TaskVisibility: {}
        }
    }
}) as any;

export const DemoSiteTexts = Texts.Site.Demo;