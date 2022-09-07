import {shallowEqual, useDispatch, useSelector} from "react-redux";


import type {SharedAppState} from "shared/state";

import type {AllSharedActions} from "shared/state/actions";

import type {ThunkDispatch} from "redux-thunk";


export const useSharedDispatch = () => useDispatch<ThunkDispatch<SharedAppState, undefined, AllSharedActions>>();

export const useSharedSelector = <TSelected = unknown>(
    selector: (state: SharedAppState) => TSelected,
    equalityFn: (left: TSelected, right: TSelected) => boolean = shallowEqual,
) => useSelector<SharedAppState, TSelected>(selector, equalityFn)
