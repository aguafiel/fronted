import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {
    menuNavegacionRoutes,
    zonasRoute,
    tipoPersonaRoute,
    tipoEmpleadosRoute,
    submenuRoute,
    unidadMedidaRoute,
    categoriaRoute,
    productosRoute,
    preciosRoute,
    empleadosRoute,
    clientesRoute,
    multitablasRoute,
    rolesRoute,
    permisosRoute,
    usuariosRoute,
    asignacionesRoute,
    preventasRoute, detalleAsignacionRoute, seguridadRoute
} from './api-routes';
import {PrecioI} from "../interfaces/PrecioI";
import {EmpleadoI} from "../interfaces/EmpleadoI";
import {ClienteI} from "../interfaces/ClienteI";
import {RolI} from 'src/interfaces/RolI';
import {PermisoI} from 'src/interfaces/PermisoI';
import {UsuarioI} from 'src/interfaces/UsuarioI';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(private http: HttpClient) {

    }

    //API PARA EL MENU DE NAVEGACION
    getMenu() {
        return this.http.get(menuNavegacionRoutes);
    }

    getMenuDescripcion() {
        return this.http.get(menuNavegacionRoutes + "/descripcion");
    }

    addMenu(data) {
        return this.http.post(menuNavegacionRoutes, data);
    }

    editMenu(data) {
        return this.http.put(menuNavegacionRoutes + `/${data.id}`, data);
    }

    deleteMenu(id) {
        return this.http.delete(menuNavegacionRoutes + `/${id}`);
    }


    //API PARA  CATEGORIAS
    getCategorias() {
        return this.http.get(categoriaRoute);
    }


    addCategoria(data) {
        return this.http.post(categoriaRoute, data);
    }

    editCategoria(data) {
        return this.http.put(categoriaRoute + `/${data.id}`, data);
    }

    deleteCategoria(id) {
        return this.http.delete(categoriaRoute + `/${id}`);
    }

    //API PARA  PRODUCTOS
    getProductos() {
        return this.http.get(productosRoute);
    }


    addProducto(data) {
        return this.http.post(productosRoute, data);
    }

    editProducto(data) {
        return this.http.put(productosRoute + `/${data.id}`, data);
    }

    deleteProducto(id) {
        return this.http.delete(productosRoute + `/${id}`);
    }


    //API PARA  UNIDADES DEMEDIDA
    getunidadesMedida() {
        return this.http.get(unidadMedidaRoute);
    }


    addUnidadMedida(data) {
        return this.http.post(unidadMedidaRoute, data);
    }

    editUnidadMedida(data) {
        return this.http.put(unidadMedidaRoute + `/${data.id}`, data);
    }

    deleteUnidadMedida(id) {
        return this.http.delete(unidadMedidaRoute + `/${id}`);
    }

    //API PARA EL SUBMENUS DE NAVEGACION
    getSubmenu() {
        return this.http.get(submenuRoute);
    }

    addSubmenu(data) {
        return this.http.post(submenuRoute, data);
    }

    editSubmenu(data) {
        return this.http.put(submenuRoute + `/${data.id}`, data);
    }

    deleteSubmenu(id) {
        return this.http.delete(submenuRoute + `/${id}`);
    }

    // API PARA ZONAS
    getZonas() {
        return this.http.get(zonasRoute);
    }

    addZonas(data) {
        return this.http.post(zonasRoute, data);
    }

    editZona(data) {
        return this.http.put(zonasRoute + `/${data.id}`, data);
    }

    deleteZona(id) {
        return this.http.delete(zonasRoute + `/${id}`);
    }

    //API PARA TIPO PERSONA

    getTipoPersona() {
        return this.http.get(tipoPersonaRoute);
    }

    addTipoPersona(data) {
        return this.http.post(tipoPersonaRoute, data);
    }

    editTipoPersona(data) {
        return this.http.put(tipoPersonaRoute + `/${data.id}`, data);
    }

    deleteTipoPersona(id) {
        return this.http.delete(tipoPersonaRoute + `/${id}`);
    }

    //API PARA TIPO PERSONA

    getTipoEmpleado() {
        return this.http.get(tipoEmpleadosRoute);
    }

    addTipoEmpleado(data) {
        return this.http.post(tipoEmpleadosRoute, data);
    }

    editTipoEmpleado(data) {
        return this.http.put(tipoEmpleadosRoute + `/${data.id}`, data);
    }

    deleteTipoEmpleado(id) {
        return this.http.delete(tipoEmpleadosRoute + `/${id}`);
    }

    //API PARA MANEJAR PRECIOS

    getPrecioProducto(productId) {
        return this.http.get(preciosRoute + "/product/" + productId);
    }

    getPrecios(productId) {
        return this.http.get(preciosRoute);
    }

    addPrecio(data: PrecioI) {
        return this.http.post(preciosRoute, data);
    }


    addListPrecio(data: PrecioI[]) {
        return this.http.post(preciosRoute + "/list", data);
    }

    editPrecio(data) {
        return this.http.put(preciosRoute + `/${data.id}`, data);
    }

    deletePrecio(id) {
        return this.http.delete(preciosRoute + `/${id}`);
    }


    //API PARA EMPLEADOS
    getEmpleados() {
        return this.http.get(empleadosRoute);
    }

    getPrevendedores() {
        return this.http.get(empleadosRoute + "/prevendedores");
    }

    addEmpleado(data: EmpleadoI) {
        return this.http.post(empleadosRoute, data);
    }


    editEmpleados(data: EmpleadoI) {
        return this.http.put(empleadosRoute + `/${data.id}`, data);
    }

    deleteEmpleados(id) {
        return this.http.delete(empleadosRoute + `/${id}`);
    }


    //API PARA CLIENTES
    getClientes() {
        return this.http.get(clientesRoute);
    }

    getClientesById(id: number) {
        return this.http.get(clientesRoute + `/${id}`);
    }


    addCliente(data: ClienteI) {
        return this.http.post(clientesRoute, data);
    }


    editCliente(data: ClienteI) {
        return this.http.put(clientesRoute + `/${data.id}`, data);
    }

    deleteCliente(id) {
        return this.http.delete(clientesRoute + `/${id}`);
    }


    //API PARA MULTITABLA
    getMultitablas() {
        return this.http.get(multitablasRoute);
    }

    getMultitablasByCode(code: string) {
        return this.http.get(multitablasRoute + "/code/" + code);
    }

    addMultitabla(data: ClienteI) {
        return this.http.post(multitablasRoute, data);
    }


    editMultitabla(data: ClienteI) {
        return this.http.put(multitablasRoute + `/${data.id}`, data);
    }

    deleteMultitabla(id) {
        return this.http.delete(multitablasRoute + `/${id}`);
    }

    //API PARA ROLES
    getRoles() {
        return this.http.get(rolesRoute);
    }

    addRol(data: RolI) {
        return this.http.post(rolesRoute, data);
    }


    editRol(data: RolI) {
        return this.http.put(rolesRoute + `/${data.id}`, data);
    }

    deleteRol(id) {
        return this.http.delete(rolesRoute + `/${id}`);
    }

    //API PARA PERMISOS
    getPermisos() {
        return this.http.get(permisosRoute);
    }

    addPermiso(data: PermisoI) {
        return this.http.post(permisosRoute, data);
    }


    editPermiso(data: PermisoI) {
        return this.http.put(permisosRoute + `/${data.id}`, data);
    }

    deletePermiso(id) {
        return this.http.delete(permisosRoute + `/${id}`);
    }


    //API PARA  USUARIOS
    getUsuarios() {
        return this.http.get(usuariosRoute);
    }

    login(login: any) {
        return this.http.post(usuariosRoute + "/login", login);
    }

    addUsuario(data: UsuarioI) {
        return this.http.post(usuariosRoute, data);
    }


    editUsuario(data: UsuarioI) {
        return this.http.put(usuariosRoute + `/${data.id}`, data);
    }

    deleteUsuario(id) {
        return this.http.delete(usuariosRoute + `/${id}`);
    }

    //API PARA  ASIGNACIONES
    getAsignaciones() {
        return this.http.get(asignacionesRoute);
    }

    getDetalleAsignados(usuarioId, diaNumber) {
        return this.http.get(asignacionesRoute + `/${usuarioId}/${diaNumber}`);
    }

    getClientesDisponibles(usuarioId, diaNumber) {
        return this.http.get(detalleAsignacionRoute + `/disponibles/${usuarioId}/${diaNumber}`);
    }

    getDetalleAsignaciones(id: number) {
        return this.http.get(asignacionesRoute + "/" + id);
    }

    addAsigncion(data: any) {
        return this.http.post(asignacionesRoute, data);
    }


    editAsignacion(data: any) {
        return this.http.put(asignacionesRoute + `/${data.id}`, data);
    }

    deleteAsignacion(id) {
        return this.http.delete(asignacionesRoute + `/${id}`);
    }

    //API PARA  PREVENTAS
    getPreventas() {
        return this.http.get(preventasRoute);
    }

    getDetallePreventas(usuarioId, diaNumber) {
        return this.http.get(preventasRoute + `/${usuarioId}/${diaNumber}`);
    }

    getReportePreventasByEmpleadoIdAndFecha(empleadoId, fecha) {
        return this.http.get(preventasRoute + `/reporte/${empleadoId}/${fecha}`);
    }


    addPreventa(data: any) {
        return this.http.post(preventasRoute, data);
    }


    editPreventa(data: any) {
        return this.http.put(preventasRoute + `/${data.id}`, data);
    }

    deletePreventa(id) {
        return this.http.delete(preventasRoute + `/${id}`);
    }

    // API PARA SEGURIDAD
    getSeguridadNavegacionPermisos() {
        return this.http.get(seguridadRoute + '/navegacion-permisos');
    }

    postSeguridadNavegacionPermisos(data: any) {
        return this.http.post(seguridadRoute + '/navegacion-permisos', data);
    }

    getSeguridadByRolId(rolId) {
        return this.http.get(seguridadRoute + '/obtener-permisos/' + rolId);
    }


}


