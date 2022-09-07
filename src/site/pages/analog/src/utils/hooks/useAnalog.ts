import type {ThunkDispatch} from "redux-thunk";
import type {AppState}      from "site/analog/state";
import type {AllActions}    from "site/analog/state/actions";

import {useDispatch, useSelector} from "react-redux";


export const useAnalogDispatch = () => useDispatch<ThunkDispatch<AppState, undefined, AllActions>>();

export const useAnalogSelector = <TSelected = unknown>(selector: (state: AppState) => TSelected) =>
                                    useSelector<AppState, TSelected>(selector)
