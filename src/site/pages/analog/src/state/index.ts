import type {AllActions}     from "./actions";
import type {SimState}       from "./Sim";
import type {Store}          from "redux";
import type {ThunkDispatch}  from "redux-thunk";
import type {SharedAppState} from "shared/state";


export type AppState = SharedAppState & {
    sim: SimState;
}

export type AppStore = Store<AppState, AllActions> & {
    dispatch: ThunkDispatch<AppState, undefined, AllActions>;
}
