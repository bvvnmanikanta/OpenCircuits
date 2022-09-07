import type {ActionCreatorType} from "shared/utils/CreateState";

import type {AllSharedActions} from "shared/state/actions";


/* eslint-disable @typescript-eslint/consistent-type-imports */
type ActionCreators =
    typeof import("./ICDesigner") &
    typeof import("./ICViewer");
/* eslint-enable @typescript-eslint/consistent-type-imports */

export type AllActions = AllSharedActions | {
    [Name in keyof ActionCreators]: ActionCreators[Name] extends ActionCreatorType
        ? ReturnType<ActionCreators[Name]>
        : never
}[keyof ActionCreators];
