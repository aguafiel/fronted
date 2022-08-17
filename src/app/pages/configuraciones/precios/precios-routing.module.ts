import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ZonaPrevendedorComponent } from './zona-prevendedor/zona-prevendedor.component';

const routes: Routes = [
  { path: 'zona-prevendedor', component: ZonaPrevendedorComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreciosRoutingModule { }
