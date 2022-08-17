import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { MultitablasComponent } from './multitablas/multitablas.component';
import { SubmenuComponent } from './submenu/submenu.component';
import { TipoEmpleadoComponent } from './tipo-empleado/tipo-empleado.component';
import { TipoPersonaComponent } from './tipo-persona/tipo-persona.component';
import { ZonasComponent } from './zonas/zonas.component';

const routes: Routes = [
  { path: 'zonas', component: ZonasComponent },
  { path: 'tipo-persona', component: TipoPersonaComponent },
  { path: 'tipo-empleados', component: TipoEmpleadoComponent },
  { path: 'multitablas', component: MultitablasComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'submenu', component: SubmenuComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaestrosRoutingModule { }
