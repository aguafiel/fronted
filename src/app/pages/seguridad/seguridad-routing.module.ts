import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermisosComponent } from './permisos/permisos.component';
import { RolesPermisosComponent } from './roles-permisos/roles-permisos.component';
import { RolesComponent } from './roles/roles.component';
import { UsuariosComponent } from "./usuarios/usuarios.component";

const routes: Routes = [
  { path: 'roles', component: RolesComponent },
  { path: 'permisos', component: PermisosComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'roles-permisos', component: RolesPermisosComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeguridadRoutingModule { }
