import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectConfig} from '@ng-select/ng-select';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {NgxSpinnerService} from 'ngx-spinner';
import {Observable} from 'rxjs';
import {ApiService} from 'src/services/api.service';
import Swal from 'sweetalert2';
import {PrecioI} from "src/interfaces/PrecioI";

@Component({
    selector: 'app-productos',
    templateUrl: './productos.component.html',
    styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {


    @ViewChild(DatatableComponent, {static: false}) table: DatatableComponent;
    listData: any[];
    rows = [];
    selectedRowData: any;
    data = [];
    timeElapsed = Date.now();
    today = new Date(this.timeElapsed);
    filteredData = [];
    columns = [{name: "nombre"}, {name: "categoria"}, {name: "categoriaId"}, {name: "categoriaId"}, {name: "codigo"}, {name: "isBonus"}, {name: "unidad"}, {name: "unidadId"}];
    editForm: FormGroup;
    register: FormGroup;
    selectedOption: string;
    public loading = false;
    @ViewChild("modalRegistro") modalRegistro: TemplateRef<any>;
    modalAddReference: any;
    modalEditReference: any;
    modalPrecios: any;
    selectedCategoria: number;
    public categorias: any[];
    labelPosition: any;
    selectedUnidad: number;
    public unidades: any[];
    public nombreProducto: string;
    public listaPrecios: Array<PrecioI> = [];
    public listNuevosPrecios: Array<PrecioI> = [];
    myControl = new FormControl();
    filteredOptions: Observable<any[]>;

    constructor(private fb: FormBuilder,
                private _snackBar: MatSnackBar,
                private modalService: NgbModal,
                private apiService: ApiService,
                private config: NgSelectConfig,
                private spinner: NgxSpinnerService,) {
    }

    cerrarModal(type: string) {
        this.selectedCategoria = null;
        this.selectedUnidad = null;
        switch (type) {
            case 'add': {
                this.modalAddReference.close();
                this.register.reset();
                break;
            }
            case 'edit': {
                this.modalEditReference.close();
                this.editForm.reset();
            }
        }
    }

    getCategorias() {
        this.apiService.getCategorias().subscribe((menu: any[]) => {
            this.categorias = menu;
        });
    }

    getUnidades() {
        this.apiService.getunidadesMedida().subscribe((menu: any[]) => {
            this.unidades = menu;
        });
    }

    getData() {
        this.apiService.getProductos().subscribe((menu: any[]) => {
            this.listData = menu;
            this.filteredData = menu;

        });
    }

    ngOnInit() {
        this.getData();
        this.getCategorias();
        this.getUnidades();
        this.register = this.fb.group({
            nombre: ['', Validators.required],
            codigo: ['', Validators.required],
            precio: ['', Validators.required],
            imagen: [''],
            isBonus: [0],
            unidadId: [0, Validators.required],
            categoriaId: [0, Validators.required]
        });
        this.editForm = this.fb.group({
            id: ['', Validators.required],
            nombre: ['', Validators.required],
            codigo: ['', Validators.required],
            precio: ['', Validators.required],
            imagen: [''],
            isBonus: [0],
            unidadId: [0, Validators.required],
            categoriaId: [0, Validators.required],
            createdAt: [''],
            updatedAt: [''],
            isDeleted: [0],
            status: [1]

        });

    }

    AgregarNuevosPrecios(row, rowIndex, content) {
        console.log(row, content);
        this.nombreProducto = row.nombre;
        this.selectedRowData = row;
        const productId = row.id;
        this.spinner.show();
        this.apiService.getPrecioProducto(productId).subscribe({
            next: value => {
                this.listaPrecios = row.precios.map(item => {
                    item.nombreProducto = row.nombre;
                    item.edit = false;
                    return item;
                });
                this.listNuevosPrecios = [];
                this.listaPrecios = row.precios.map(item => {
                    item.nombreProducto = row.nombre;
                    item.edit = false;
                    return item;
                });
                this.listNuevosPrecios = [];
                this.modalPrecios = this.modalService.open(content, {size: 'lg', backdrop: "static"});
                this.spinner.hide();
            },
            error: error => {
                this.spinner.hide();
            }
        });
    }

    editPrecio(index, type) {
        if (type === 'old') {
            this.listaPrecios[index].edit = true;
        }
        if (type === 'new') {
            this.listNuevosPrecios[index].edit = true;
        }
    }

    cancelaEditPrecio(index, type) {
        if (type === 'old') {
            this.listaPrecios[index].edit = false;
        }
        if (type === 'new') {
            //quitamos de la lista puesto que se cancela el registro
            this.listNuevosPrecios.splice(index, 1);
        }
    }

    getPreciosProductService(productId) {
        this.apiService.getPrecioProducto(productId).subscribe({
            next: (value: any[]) => {
                this.listaPrecios = value.map(item => {
                    item.nombreProducto = this.selectedRowData.nombre;
                    item.edit = false;
                    return item;
                });
                this.spinner.hide();
            },
            error: error => {
                this.spinner.hide();
            }
        });
    }

    editPrecioService(precio) {
        const {id} = this.selectedRowData;
        Swal.fire({
            title: 'Editar Precio?',
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.value) {
                this.spinner.show();
                this.apiService.editPrecio(precio).subscribe({
                    next: (v) => {
                        this.spinner.hide();
                        this.getData();
                        Swal.fire('Actualizado!', 'Precio Actualizado.', 'success');
                        this.getPreciosProductService(precio.productoId);
                    },
                    error: (v) => {
                        this.spinner.hide();
                    }
                });

            }
        });
    }

    registerListPrecioService() {
        console.log(this.listNuevosPrecios);
        console.log(this.selectedRowData);
        Swal.fire({
            title: 'Registrar Precios',
            icon: 'info',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.value) {
                this.spinner.show();
                this.apiService.addListPrecio(this.listNuevosPrecios).subscribe({
                    next: (v) => {
                        this.spinner.hide();
                        this.getData();
                        Swal.fire('Registrado!', 'Precios Registrados.', 'success');
                        this.listNuevosPrecios = [];
                        this.getPreciosProductService(this.selectedRowData.id);
                    },
                    error: (v) => {
                        this.spinner.hide();
                    }
                });

            }
        });
    }

    deletePrecioService(id, productoId) {

        Swal.fire({
            title: 'Eliminar Precio?',
            text: "Seguro de eliminar !!",
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.value) {
                this.spinner.show();
                this.apiService.deletePrecio(id).subscribe({
                    next: (v) => {
                        this.spinner.hide();
                        this.getData();
                        Swal.fire('Eliminado!', 'Registro Eliminado.', 'success');
                        this.getPreciosProductService(productoId);
                    },
                    error: (v) => {
                        this.spinner.hide();
                    }
                });
            }
        });
    }

    addPrecioService(precio) {
        Swal.fire({
            title: 'Registrar Precio',
            icon: 'info',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.value) {
                this.spinner.show();
                this.apiService.addPrecio(precio).subscribe({
                    next: (v) => {
                        this.spinner.hide();
                        this.getData();
                        Swal.fire('Registrado!', 'Precio Registrado.', 'success');
                        this.getPreciosProductService(precio.productoId);
                    },
                    error: (v) => {
                        this.spinner.hide();
                    }
                });

            }
        });
    }

    registerPrecio(index, type) {
        if (type === 'old') {
            const precio = this.listaPrecios[index];
            // console.log(precio)
            this.editPrecioService(precio);
            // this.listaPrecios[index].edit = false;
        }
        if (type === 'new') {
            //quitamos de la lista puesto que se cancela el registro
            const precio = this.listNuevosPrecios[index];
            this.listNuevosPrecios.splice(index, 1);
            this.addPrecioService(precio);
        }
    }


    pushPrecios() {
        // console.log(this.selectedRowData);
        const newPrecio: PrecioI = {
            precio: 0.0,
            productoId: this.selectedRowData.id,
            nombreProducto: this.selectedRowData.nombre,
            id: undefined,
            edit: true,
            status: undefined,
            isDeleted: undefined,
            updatedAt: undefined,
            createdAt: undefined
        };
        this.listNuevosPrecios.push(newPrecio);
        // this.listaPrecios.push(newPrecio);
    }

    cerrarModalPrecio() {
        this.modalPrecios.close();
    }

    setPrecio(index, value, type) {
        if (type == 'old') {
            this.listaPrecios[index].precio = value;
        }
        if (type == 'new') {
            this.listNuevosPrecios[index].precio = value;
        }

    }

    deletePrecio(index, type) {
        if (type == 'old') {
            const id = this.listaPrecios[index].id;
            const productId = this.listaPrecios[index].productoId;
            this.deletePrecioService(id, productId);
        }
        if (type == 'new') {
            this.listNuevosPrecios.splice(index, 1);
        }

    }

    editRow(row, rowIndex, content) {
        this.modalEditReference = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
        this.selectedCategoria = row.categoriaId;
        this.selectedUnidad = row.unidadId;
        this.editForm.setValue({
            id: row.id,
            codigo: row.codigo,
            nombre: row.nombre,
            precio: row.precio,
            imagen: row.imagen,
            isBonus: row.isBonus == 1 ? 1 : 0,
            unidadId: row.unidadId,
            categoriaId: row.categoriaId,
            createdAt: row.createdAt,
            updatedAt: this.today.toISOString(),
            status: row.status,
            isDeleted: row.isDeleted,
        });
        this.selectedRowData = row;
    }

    addRow(content) {
        this.modalAddReference = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    }

    deleteRow(row) {
        Swal.fire({
            title: 'Eliminar Producto?',
            text: "Seguro de eliminar !!",
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.value) {
                this.spinner.show();
                this.apiService.deleteProducto(row.id).subscribe({
                    next: (v) => {
                        this.spinner.hide();
                        this.getData();
                        Swal.fire('Eliminado!', 'Registro Eliminado.', 'success');
                    },
                    error: (v) => {
                        this.spinner.hide();
                    }
                });

            }
        });


    }

    onEditSave(form: FormGroup) {
        if (form.valid) {
            this.spinner.show();
            this.apiService.editProducto(form.value).subscribe({
                next: (v) => {
                    this.spinner.hide();
                    this.getData();
                    this.showNotification(
                        'bg-black',
                        'Actualización correcta',
                        'bottom',
                        'right'
                    );
                    this.cerrarModal('edit');
                },
                error: (v) => {
                    this.spinner.hide();
                }
            });

        } else {
            this.showNotification(
                'bg-red',
                'Completar los campos',
                'bottom',
                'right'
            );
        }

    }

    onAddRowSave(form: FormGroup) {
        this.data = form.value;
        this.spinner.show();
        this.apiService.addProducto(this.data).subscribe({
            next: (v) => {
                this.spinner.hide();
                this.getData();
                this.cerrarModal('add');
                this.showNotification(
                    'bg-green',
                    'Producto registrado!!!',
                    'bottom',
                    'right'
                );
            },
            error: (v) => {
                this.spinner.hide();
            }
        });

    }

    filterDatatable(event) {
        // console.log(event);
        // get the value of the key pressed and make it lowercase
        const value = event.target.value.toLowerCase();

        // get the amount of columns in the table
        const count = this.columns.length;

        // get the key names of each column in the dataset
        const keys = Object.keys(this.filteredData[0]);

        // assign filtered matches to the active datatable
        this.listData = this.filteredData.filter((item) => {
            // iterate through each row's column data
            for (let i = 0; i <= count; i++) {
                // check for a match
                if (
                    (item[keys[i]] &&
                        item[keys[i]].toString().toLowerCase().indexOf(value) !== -1) ||
                    !value
                ) {
                    // found match, return true to add to result set
                    return true;
                }
            }
        });

        // Whenever the filter changes, always go back to the first page
        this.table.offset = 0;
    }

    onSort(event) {
        // event was triggered, start sort sequence
        setTimeout(() => {
            const rows = [this.rows];
            // this is only for demo purposes, normally
            // your server would return the result for
            // you and you would just set the rows prop
            const sort = event.sorts[0];
            rows.sort((a, b) => {
                return (
                    a[sort.prop].localeCompare(b[sort.prop]) *
                    (sort.dir === 'desc' ? -1 : 1)
                );
            });

            this.rows = rows;
        }, 1000);
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
