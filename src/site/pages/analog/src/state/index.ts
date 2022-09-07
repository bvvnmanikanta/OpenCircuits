
import type {SharedAppState} from "shared/state";

import type {AllActions}    from "./actions";
import type {SimState}      from "./Sim";
import type {Store}         from "redux";
import type {ThunkDispatch} from "redux-thunk";


export type AppState = SharedAppState & {
    sim: SimState;
}

export type AppStore = Store<AppState, AllActions> & {
    dispatch: ThunkDispatch<AppState, undefined, AllActions>;
}
