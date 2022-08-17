import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsignacionesComponent } from './asignaciones/asignaciones.component';
import { VerAsignacionComponent } from './asignaciones/ver-asignacion/ver-asignacion.component';

const routes: Routes = [
  { path: 'asignaciones', component: AsignacionesComponent },
  { path: 'ver-asignacion/:id', component: VerAsignacionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreventasRoutingModule { }
