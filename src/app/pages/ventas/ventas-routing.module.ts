import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreventasComponent } from './preventas/preventas.component';
import { VisitaComponent } from './preventas/visita/visita.component';
import { ReportePreventasComponent } from './reporte-preventas/reporte-preventas.component';

const routes: Routes = [{
  path: 'preventas', component: PreventasComponent,
},
{
  path: 'preventas/visita', component: VisitaComponent,
},
{
  path: 'reporte-preventas', component: ReportePreventasComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
