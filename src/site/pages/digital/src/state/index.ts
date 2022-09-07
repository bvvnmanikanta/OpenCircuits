
import type {SharedAppState} from "shared/state";

import type {AllActions}      from "./actions";
import type {ICDesignerState} from "./ICDesigner";
import type {ICViewerState}   from "./ICViewer";
import type {Store}           from "redux";
import type {ThunkDispatch}   from "redux-thunk";


export type AppState = SharedAppState & {
    icDesigner: ICDesignerState;
    icViewer: ICViewerState;
}

export type AppStore = Store<AppState, AllActions> & {
    dispatch: ThunkDispatch<AppState, undefined, AllActions>;
}
