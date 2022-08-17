import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriasComponent } from './categorias/categorias.component';
import { AddClienteComponent } from './clientes/add-cliente/add-cliente.component';
import { ClientesComponent } from './clientes/clientes.component';
import { EditClienteComponent } from './clientes/edit-cliente/edit-cliente.component';
import { AddEmpleadoComponent } from './empleados/components/add-empleado/add-empleado.component';
import { EditEmpleadoComponent } from './empleados/components/edit-empleado/edit-empleado.component';
import { EmpleadosComponent } from './empleados/empleados.component';
import { ProductosComponent } from './productos/productos.component';
import { UnidadesMedidaComponent } from './unidades-medida/unidades-medida.component';

const routes: Routes = [
  { path: 'clientes', component: ClientesComponent },
  { path: 'empleados', component: EmpleadosComponent },
  { path: 'add-cliente', component: AddClienteComponent },
  { path: 'edit-cliente/:id', component: EditClienteComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'unidades', component: UnidadesMedidaComponent },
  { path: 'categorias', component: CategoriasComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule { }
