import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministracionRoutingModule } from './administracion-routing.module';
import { ClientesComponent } from './clientes/clientes.component';
import { EmpleadosComponent } from './empleados/empleados.component';
import { ProductosComponent } from './productos/productos.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { UnidadesMedidaComponent } from './unidades-medida/unidades-medida.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AddEmpleadoComponent } from './empleados/components/add-empleado/add-empleado.component';
import { EditEmpleadoComponent } from './empleados/components/edit-empleado/edit-empleado.component';
import { AddClienteComponent } from './clientes/add-cliente/add-cliente.component';
import { EditClienteComponent } from './clientes/edit-cliente/edit-cliente.component';


@NgModule({
  declarations: [
    ClientesComponent,
    EmpleadosComponent,
    ProductosComponent,
    CategoriasComponent,
    UnidadesMedidaComponent,
    AddEmpleadoComponent,
    EditEmpleadoComponent,
    AddClienteComponent,
    EditClienteComponent
  ],
    imports: [
        CommonModule,
        AdministracionRoutingModule,
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
        FeatherModule.pick(allIcons),
        FormsModule
    ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    FeatherModule
  ]
})
export class AdministracionModule { }
