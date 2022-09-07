import type {CircuitInfoState} from "./CircuitInfo";
import type {ContextMenuState} from "./ContextMenu";
import type {DebugInfoState}   from "./DebugInfo";
import type {HeaderState}      from "./Header";
import type {ItemNavState}     from "./ItemNav";
import type {SideNavState}     from "./SideNav";
import type {UserInfoState}    from "./UserInfo";


export type SharedAppState = {
    user: UserInfoState;
    circuit: CircuitInfoState;
    header: HeaderState;
    sideNav: SideNavState;
    itemNav: ItemNavState;
    contextMenu: ContextMenuState;
    debugInfo: DebugInfoState;
}
