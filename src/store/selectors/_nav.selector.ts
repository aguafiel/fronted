import {createFeatureSelector, createSelector} from "@ngrx/store";
import {UserI} from "src/interfaces/UserI";

import * as usuarioReducer from "../reducers/usuario.reducer";

export const getMenuState = createFeatureSelector<UserI>('menuState');

export const getMenu = createSelector(
    getMenuState,
    (state: any) => state
);

