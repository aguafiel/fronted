import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaestrosRoutingModule } from './maestros-routing.module';
import { ZonasComponent } from './zonas/zonas.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { ReactiveFormsModule } from '@angular/forms';

import { NgxSpinnerModule } from 'ngx-spinner';
import { TipoPersonaComponent } from './tipo-persona/tipo-persona.component';
import { TipoEmpleadoComponent } from './tipo-empleado/tipo-empleado.component';
import { MultitablasComponent } from './multitablas/multitablas.component';
import { MenuComponent } from './menu/menu.component';
import { SubmenuComponent } from './submenu/submenu.component';
import { allIcons } from 'angular-feather/icons';
import { FeatherModule } from 'angular-feather';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
@NgModule({
  declarations: [
    ZonasComponent,
    TipoPersonaComponent,
    TipoEmpleadoComponent,
    MultitablasComponent,
    MenuComponent,
    SubmenuComponent,

  ],

  imports: [
    FormsModule,
    CommonModule,
    MaestrosRoutingModule,
    NgxDatatableModule,
    NgSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatSortModule,
    MatToolbarModule,
    MatMenuModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    MatAutocompleteModule,
     FeatherModule.pick(allIcons)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    FeatherModule
  ]
})
export class MaestrosModule { }
