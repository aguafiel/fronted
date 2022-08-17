import { createAction, props } from '@ngrx/store';
import {UserI} from "src/interfaces/UserI";
export const usuarioAction = createAction('_UsuarioStore', props<{ payload: UserI }>());