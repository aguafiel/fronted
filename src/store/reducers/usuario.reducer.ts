import {Action, createReducer, on} from '@ngrx/store';
import {UserI} from 'src/interfaces/UserI';
import {usuarioAction} from '../actions/usuario.action';


export let usuarioState: UserI = {};

export const _usuarioReducer = createReducer(
    usuarioState,
    on(usuarioAction, (state, {payload}) => {
        // console.log(state)
        // console.log(payload)
        return payload;
    })
);

export function UsuarioReducer(state, action) {
    return _usuarioReducer(state, action);
}
