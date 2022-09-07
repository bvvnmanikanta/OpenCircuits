import type {AllSharedActions}  from "shared/state/actions";
import type {ActionCreatorType} from "shared/utils/CreateState";


/* eslint-disable @typescript-eslint/consistent-type-imports */
type ActionCreators =
    typeof import("./Sim");
/* eslint-enable @typescript-eslint/consistent-type-imports */

export type AllActions = AllSharedActions | {
    [Name in keyof ActionCreators]: ActionCreators[Name] extends ActionCreatorType
        ? ReturnType<ActionCreators[Name]>
        : never
}[keyof ActionCreators];
