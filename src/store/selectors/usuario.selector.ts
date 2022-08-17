
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserI } from "src/interfaces/UserI";

import * as usuarioReducer from "../reducers/usuario.reducer"

export const getUsuarioState = createFeatureSelector<UserI>('usuarioState')

export const getUsuario = createSelector(
    getUsuarioState,
    (state: UserI) => state
)

