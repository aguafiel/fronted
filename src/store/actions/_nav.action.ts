import { createAction, props } from '@ngrx/store';
export const _navAction = createAction('_navAction', props<{ payload: Array<any> }>());