import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreciosRoutingModule } from './precios-routing.module';
import { ZonaPrevendedorComponent } from './zona-prevendedor/zona-prevendedor.component';


@NgModule({
  declarations: [
    ZonaPrevendedorComponent
  ],
  imports: [
    CommonModule,
    PreciosRoutingModule
  ]
})
export class PreciosModule { }
