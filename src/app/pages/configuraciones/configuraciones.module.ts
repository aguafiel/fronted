import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfiguracionesRoutingModule } from './configuraciones-routing.module';
import { PreciosModule } from './precios/precios.module';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ConfiguracionesRoutingModule,
    PreciosModule,
    NgxSpinnerModule,
  ]
})
export class ConfiguracionesModule { }
