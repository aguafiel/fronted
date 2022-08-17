import { createReducer, on } from "@ngrx/store";
import { _navAction } from "../actions/_nav.action";
import {generateMenu} from "../../common/functions/generateMenu";
export let navMenu: Array<any> = generateMenu();
export const _listMenus = createReducer(
    navMenu,
    on(_navAction, (state, { payload }) => {
        return [...payload];
    })
);


export function listMenusReducer(state, action) {
    return _listMenus(state, action);
}