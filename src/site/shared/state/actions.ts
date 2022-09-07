import type {ActionCreatorType} from "shared/utils/CreateState";


/* eslint-disable @typescript-eslint/consistent-type-imports */
type ActionCreators =
    typeof import("./Header")      &
    typeof import("./ContextMenu") &
    typeof import("./SideNav")     &
    typeof import("./ItemNav")     &
    typeof import("./CircuitInfo") &
    typeof import("./UserInfo")    &
    typeof import("./DebugInfo");
/* eslint-enable @typescript-eslint/consistent-type-imports */

export type AllSharedActions = {
    [Name in keyof ActionCreators]: ActionCreators[Name] extends ActionCreatorType
        ? ReturnType<ActionCreators[Name]>
        : never
}[keyof ActionCreators];
