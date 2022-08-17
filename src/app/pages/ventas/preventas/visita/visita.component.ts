import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ArrayHelper} from 'src/common/helpers/arrays';
import {ApiService} from 'src/services/api.service';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
    selector: 'app-visita',
    templateUrl: './visita.component.html',
    styleUrls: ['./visita.component.scss']
})
export class VisitaComponent implements OnInit {

    listProductos: any[];
    listProductosSeleccionados: any[] = [];
    informacionCliente: any = null;
    clienteId: number;
    empleadoId: number;
    day: number;
    subtotalPreventa = 0.0;
    @ViewChild("modalPrecios") modalPrecios: TemplateRef<any>;
    referenceCantidadModal: any;
    referencePreciosModal: any;
    productSelectedModal: any;
    cantidadFinal = 0;
    listMNC: any[] = [];
    mncSelected: any = undefined;
    observacion = "";

    constructor(private apiService: ApiService,
                private activeRouter: ActivatedRoute,
                private router: Router,
                private spinner: NgxSpinnerService,
                private modalService: NgbModal,
                private _snackBar: MatSnackBar,) {
        this.activeRouter.queryParams.subscribe(params => {
            this.clienteId = parseInt(params.clienteId);
            const usuario: any = JSON.parse(localStorage.getItem("usuario"));
            this.empleadoId = usuario.empleado.id;
            this.day = parseInt(params.day);
        });

    }

    ngOnInit(): void {
        this.getDataProductosService();
        this.getInformacionCliente();
        this.getListMNCService();
    }

    handleActiveMnc(index) {
        this.listMNC.forEach((item, i) => {
            // item.active = false;
            if (i === index) {
                if (this.listMNC[index].active) {
                    // console.log('true');
                    this.listMNC[index].active = false;
                    this.mncSelected = undefined;
                } else {
                    // console.log('false');
                    this.mncSelected = this.listMNC[index];
                    this.listMNC[index].active = true;
                }
            } else {
                item.active = false;
            }
        });
    }

    getListMNCService() {
        this.apiService.getMultitablasByCode('mnc')
            .subscribe({
                next: (value: any) => {
                    this.listMNC = value.data.map(item => {
                        item.active = false;
                        return item;
                    });
                }
            });
    }

    getInformacionCliente() {
        this.apiService.getClientesById(this.clienteId)
            .subscribe({
                next: (v: any) => {
                    console.log(v)
                    this.informacionCliente = v.data;
                }
            });
    }

    setCantidadFinal() {
        const product = this.productSelectedModal;
        const findIndexResult = ArrayHelper.findIndexByProperty(this.listProductosSeleccionados, 'id', product.id);
        this.listProductosSeleccionados[findIndexResult].cantidad_products = this.cantidadFinal;
        this.listProductosSeleccionados[findIndexResult].subtotal = this.cantidadFinal * this.listProductosSeleccionados[findIndexResult].precioFinal;
        this.cantidadFinal = 0;
        this.referenceCantidadModal.close();
        this.calcularSubtotal();
    }

    getDataProductosService() {
        this.apiService.getProductos().subscribe({
            next: (v: any[]) => {
                console.log(v)
                this.listProductos = v;
            }
        });
    }

    handleSeleccionarProducto(index) {

        // obtenemos el producto que se va a anadir al carrito
        let product = {...this.listProductos[index], cantidad_products: 1};
        let precioFinal = this.listProductos[index].precio;
        let cantidadProductos = product.cantidad_products;
        // verificamos que no el producto no se encuentre registrado
        const findResult = ArrayHelper.findIndexByProperty(this.listProductosSeleccionados, 'id', product.id);
        // si no se encuentra registrado se inserta un dato inicializado
        if (findResult === -1) {
            product = {...product, subtotal: cantidadProductos * precioFinal, precioFinal};
            this.listProductosSeleccionados.push(product);
        } else {
            // si ya se encuentra registrado se actualiza las cantidades y los montos
            this.listProductosSeleccionados[findResult].cantidad_products += 1;
            cantidadProductos = this.listProductosSeleccionados[findResult].cantidad_products;
            precioFinal = this.listProductosSeleccionados[findResult].precioFinal;
            this.listProductosSeleccionados[findResult].subtotal = cantidadProductos * precioFinal;
        }
        this.calcularSubtotal();
    }

    handleSeleccionarPrecio(precio) {
        const product = this.productSelectedModal;
        const findIndexResult = ArrayHelper.findIndexByProperty(this.listProductosSeleccionados, 'id', product.id);
        this.listProductosSeleccionados[findIndexResult].precioFinal = precio;
        this.listProductosSeleccionados[findIndexResult].subtotal = precio * this.listProductosSeleccionados[findIndexResult].cantidad_products;
        this.referencePreciosModal.close();
        this.calcularSubtotal();
        // this.productSelectedModal = null;
    }

    abrirModal(type, content, product) {
        this.productSelectedModal = product;
        switch (type) {
            case 'precios': {
                this.referencePreciosModal = this.modalService.open(content, {backdrop: 'static'});
                break;
            }
            case 'cantidad': {
                this.referenceCantidadModal = this.modalService.open(content, {backdrop: 'static'});
                break;
            }
        }
    }

    cerrarModal(type) {
        this.productSelectedModal = null;
        switch (type) {
            case 'precios': {
                this.referencePreciosModal.close();
                break;
            }
            case 'cantidad': {
                this.cantidadFinal = 0;
                this.referenceCantidadModal.close();
                break;
            }
        }
    }


    eliminarProducto(index) {
        this.listProductosSeleccionados.splice(index, 1);
        this.calcularSubtotal();
    }

    calcularSubtotal() {
        this.subtotalPreventa = 0.0;
        this.listProductosSeleccionados.forEach(item => {
            this.subtotalPreventa += item.cantidad_products * item.precioFinal;
        });
    }

    limpiarDatos() {
        this.listProductos = [];
        this.listProductosSeleccionados = [];
        this.informacionCliente = null;
        this.clienteId = 0;
        this.empleadoId = 0;
        this.day = 0;
        this.subtotalPreventa = 0.0;
        this.referenceCantidadModal = null;
        this.referencePreciosModal = null;
        this.productSelectedModal = null;
        this.cantidadFinal = 0;
        this.listMNC = [];
        this.mncSelected = undefined;
        this.observacion = "";
    }

    registrarPreventa() {
        const productos = [];
        this.listProductosSeleccionados.forEach(item => {
            const product = {
                productId: item.id,
                precio: item.precioFinal,
                cantidad: item.cantidad_products,
                subtotal: item.subtotal
            };
            productos.push(product);
        });
        const form = {
            observacion: this.observacion,
            mncId: this.mncSelected !== undefined ? this.mncSelected.id : undefined,
            clienteId: this.clienteId,
            empleadoId: this.empleadoId,
            total: this.subtotalPreventa,
            diaId: this.day,
            detallePreventas: productos.length > 0 ? productos : undefined
        };
        this.spinner.show();
        this.apiService.addPreventa(form)
            .subscribe({
                next: (result: any) => {
                    this.spinner.hide();
                    this.limpiarDatos();
                    this.showNotification('bg-green',
                        'Preventa Registrada',
                        'top',
                        'right');
                    this.router.navigate(['/ventas/preventas']);
                },
                error: (error: any) => {
                    this.spinner.hide();
                    this.showNotification('bg-red',
                        'Error al registrar preventa',
                        'top',
                        'right');
                }
            });
    }

    showNotification(colorName, text, placementFrom, placementAlign) {
        this._snackBar.open(text, '', {
            duration: 2000,
            verticalPosition: placementFrom,
            horizontalPosition: placementAlign,
            panelClass: colorName
        });
    }
}
