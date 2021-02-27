import {Circuit} from "core/models/Circuit";
import {connect} from "react-redux";

import {SharedAppState} from "shared/state";
import {ToggleCircuitLocked, SetCircuitName, SetCircuitSaved, SaveCircuit} from "shared/state/CircuitInfo/actions";
import {ToggleSideNav} from "shared/state/SideNav/actions";
import {CircuitInfoHelpers} from "shared/utils/CircuitInfoHelpers";

import "./index.scss";


type OwnProps = {
    helpers: CircuitInfoHelpers;
}
type StateProps = {
    circuitName: string;
    isSaved: boolean;
    isLocked: boolean;
    isLoggedIn: boolean;
    isLoading: boolean;
}
type DispatchProps = {
    toggleLock: () => void;
    toggleSideNav: () => void;
    setCircuitName: (name: string) => void;
}

type Props = StateProps & DispatchProps & OwnProps;
const _HeaderLeft = ({ isLocked, isSaved, isLoggedIn, isLoading, circuitName, helpers, toggleLock, toggleSideNav, setCircuitName }: Props) => (
    <div className="header__left">
        <div>
            <span title="Side Bar" role="button" tabIndex={0}
                  onClick={() => toggleSideNav()}>&#9776;</span>
        </div>
        <div>
            <button className="header__left__lock"
                    title="Lock/Unlock Editing"
                    onClick={() => toggleLock()}>
                <img src="img/icons/lock_open.svg" className={isLocked ? "hide" : ""} alt="Icon for unlocked lock" />
                <img src="img/icons/lock.svg"      className={isLocked ? "" : "hide"} alt="Icon for lock" />
            </button>
        </div>
        <div>
            <input title="Circuit Name" type="text"
                   value={circuitName}
                   placeholder="Untitled Circuit*"
                   onChange={(s) => setCircuitName(s.target.value)}
                   alt="Name of project" />
        </div>
        <div>
            <button className={`header__left__save ${isSaved || !isLoggedIn ? "invisible" : ""}`}
                    title="Save the circuit remotely"
                    disabled={isLoading}
                    onClick={() => helpers.SaveCircuitRemote()}>Save</button>
        </div>
        <div>
            <input className={`header__left__save ${isSaved || !isLoggedIn ? "invisible" : ""}`}
                   title="Turn auto save on"
                   type='checkbox'
            ></input>
        </div>
    </div>
);


/*
 * Redux state connection
 */
const MapState = (state: SharedAppState) => ({
    circuitName: state.circuit.name,
    isSaved:     state.circuit.isSaved,
    isLocked:    state.circuit.isLocked,
    isLoggedIn:  state.user.isLoggedIn,
    isLoading:   state.user.loading
});
const MapDispatch = {
    toggleLock:     ToggleCircuitLocked,
    toggleSideNav:  ToggleSideNav,
    setCircuitName: SetCircuitName,
};
export const HeaderLeft = connect<StateProps, DispatchProps, OwnProps, SharedAppState>(
    MapState,
    MapDispatch
)(_HeaderLeft);
