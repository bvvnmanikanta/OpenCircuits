import {useDispatch, useSelector} from "react-redux";


import type {AppState} from "site/analog/state";

import type {AllActions} from "site/analog/state/actions";

import type {ThunkDispatch} from "redux-thunk";


export const useAnalogDispatch = () => useDispatch<ThunkDispatch<AppState, undefined, AllActions>>();

export const useAnalogSelector = <TSelected = unknown>(selector: (state: AppState) => TSelected) =>
                                    useSelector<AppState, TSelected>(selector)
