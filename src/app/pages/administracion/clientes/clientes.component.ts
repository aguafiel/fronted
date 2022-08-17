import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DatatableComponent, ColumnMode } from "@swimlane/ngx-datatable";
import { PersonaI } from "src/interfaces/PersonaI";
import { TipoEmpleadoI } from "src/interfaces/TipoEmpleadoI";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ApiService } from "src/services/api.service";
import { NgSelectConfig } from "@ng-select/ng-select";
import { NgxSpinnerService } from "ngx-spinner";
import Swal from "sweetalert2";
import { EmpleadoI } from "src/interfaces/EmpleadoI";
import * as moment from "moment";
import { ClienteI } from "src/interfaces/ClienteI";
import { TipoPersonaI } from "src/interfaces/TipoPersonaI";
import { sunatService } from "src/services/sunat.service";
import { error } from "protractor";
import { ZonaI } from "src/interfaces/ZonaI";
import { MultitablaI } from "src/interfaces/MultitablaI";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';


interface FormTextOptionsI {
    isNatural: boolean;
    isDni: boolean;
}


@Component({
    selector: 'app-clientes',
    templateUrl: './clientes.component.html',
    styleUrls: ['./clientes.component.sass']
})
export class ClientesComponent implements OnInit {

    @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
    listData: ClienteI[];
    listTipoPersona: TipoPersonaI[];
    listZonas: ZonaI[];
    listDias: MultitablaI[];

    rows = [];
    selectedRowData: ClienteI;
    data = [];
    timeElapsed = Date.now();
    today = new Date(this.timeElapsed);
    filteredData = [];
    columns = [{ name: "nombre" }, { name: "abreviatura" }, { name: "status" }];
    editForm: FormGroup;
    register: FormGroup;
    selectedOption: string;
    public loading = false;
    @ViewChild("modalRegistro") modalRegistro: TemplateRef<any>;
    modalAddReference: any;
    modalEditReference: any;
    public moment = moment;
    selectedTipoPersona: string;
    formTextFields: FormTextOptionsI;
    columnMode = ColumnMode
    myControl = new FormControl();
    filteredOptions: Observable<any[]>;
    dataSource3 = null;
    displayedColumns: string[] = [
        'id',
        'nombre',
        'tipoPersona',
        'status',
        'tipoDocumento',
        'comprobante',
        'nroDocumento',
        'celular',
        "opciones"

    ];
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


    constructor(private fb: FormBuilder,
        private _snackBar: MatSnackBar,
        private modalService: NgbModal,
        private apiService: ApiService,
        private config: NgSelectConfig,
        private spinner: NgxSpinnerService,) {
    }


    handleChangeTipoPersona() {
        switch (this.selectedTipoPersona) {
            case "natural": {
                this.formTextFields = {
                    isNatural: true,
                    isDni: true
                };
                break;
            }
            case "juridico": {
                this.formTextFields = {
                    isNatural: false,
                    isDni: false
                };
                break;
            }
        }
    }

    cerrarModal(type: string) {
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
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        console.log(filterValue)
        this.dataSource3.filter = filterValue.trim().toLowerCase();
    }
    getData() {
        this.apiService.getClientes().subscribe((data: ClienteI[]) => {
            console.log(data);
            this.listData = data;
            this.filteredData = data;
            this.dataSource3 = new MatTableDataSource(data)
            this.dataSource3.paginator = this.paginator;
        });
    }

    getDataZonas() {
        this.apiService.getZonas()
            .subscribe({
                next: (v: ZonaI[]) => {
                    this.listZonas = v;
                },
                error: (v) => {
                    console.log(v);
                }
            });
    }

    getDataTipoCliente() {
        this.apiService.getTipoPersona().subscribe((data: TipoPersonaI[]) => {

            this.listTipoPersona = data;
        });
    }

    getDataDias() {
        this.apiService.getMultitablasByCode("dias")
            .subscribe((value: MultitablaI[]) => {
                this.listDias = value;
            });
    }


    ngOnInit() {
        this.getData();
        this.getDataTipoCliente();
        this.getDataZonas();
        this.getDataDias();

        this.register = this.fb.group({
            nombre: ['', Validators.required],
            tipoPersonaId: ['', Validators.required],
            diaId: ['', Validators.required],
            tipoDocumento: ['', Validators.required],
            nroDocumento: ['', Validators.required],
            apellidos: ['', Validators.required],
            genero: ['', Validators.required],
            zonaId: ['', Validators.required],
            nroOrden: ['', Validators.required],
            fechaNacimiento: [''],
            celular: [''],
            email: [''],
            direccion: [''],
            codigo: [''],


        });
        this.editForm = this.fb.group({
            id: ['', Validators.required],
            nombre: ['', Validators.required],
            tipoEmpleadoId: ['', Validators.required],
            tipoDocumento: ['', Validators.required],
            nroDocumento: ['', Validators.required],
            apellidos: ['', Validators.required],
            genero: ['', Validators.required],
            personaId: ['', Validators.required],
            fechaNacimiento: [''],
            celular: [''],
            email: [''],
            direccion: [''],
            createdAt: [''],
            updatedAt: [''],
            isDeleted: [0],
            status: [1]

        });
        this.formTextFields = { isNatural: true, isDni: true };

    }

    // searchDataSunatService() {
    //     const nroDocumento = this.register.get("nroDocumento").value;
    //     sunatService.consultaDatos(nroDocumento)
    //         .then(response => response.json())
    //         .then(data => {
    //             this.register.setValue({
    //                 ...this.register.value,
    //                 nombre: data.name,
    //                 apellidos: data.surname,
    //                 direccion: data.address,
    //                 tipoDocumento: data.document_type
    //             });
    //         })
    //         .catch(error => {
    //             console.log(error);
    //         });

    // }


    editRow(row, rowIndex, content) {
        console.log(row);
        this.modalEditReference = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: "static" });

        this.editForm.setValue({
            id: row.id,
            nombre: row.persona.nombre,
            tipoEmpleadoId: row.tipoEmpleadoId,
            tipoDocumento: row.persona.tipoDocumento,
            nroDocumento: row.persona.nroDocumento,
            apellidos: row.persona.apellidos,
            genero: row.persona.genero,
            personaId: row.persona.id,
            fechaNacimiento: this.moment(row.persona.fechaNacimiento).format('YYYY / MM / DD'),
            celular: row.persona.celular,
            email: row.persona.email,
            direccion: row.persona.direccion,
            createdAt: row.createdAt,
            updatedAt: this.today.toISOString(),
            status: row.status,
            isDeleted: row.isDeleted,
        });
        this.selectedRowData = row;
    }

    addRow(content) {
        this.modalAddReference = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: "static" });
    }

    deleteRow(row) {
        Swal.fire({
            title: 'Eliminar Cliente?',
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
                this.apiService.deleteCliente(row.id).subscribe({
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

            const values = form.value;

            const data: EmpleadoI = {
                id: values.id,
                isDeleted: values.isDeleted,
                createdAt: values.createdAt,
                updatedAt: this.today.toISOString(),
                status: values.status,
                tipoEmpleadoId: values.tipoEmpleadoId,
                personaId: values.personaId,
                persona: {
                    id: values.personaId,
                    celular: values.celular + "",
                    fechaNacimiento: this.moment(values.fechaNacimiento).toISOString(),
                    email: values.email,
                    tipoDocumento: values.tipoDocumento,
                    apellidos: values.apellidos,
                    genero: values.genero,
                    direccion: values.direccion,
                    nombre: values.nombre,
                    nroDocumento: values.nroDocumento,
                    status: values.status,
                    isDeleted: values.isDeleted,
                    updatedAt: this.today.toISOString(),
                    createdAt: values.createdAt
                }
            };

            console.log(data);

            this.spinner.show();
            this.apiService.editEmpleados(data).subscribe({
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
        const values = form.value;

        const data: ClienteI = {
            id: undefined,
            isDeleted: undefined,
            createdAt: undefined,
            updatedAt: undefined,
            status: undefined,
            // tipoPersonaId: values.tipoPersonaId,
            tipoPersonaId: 1,
            nroOrden: values.nroOrden,
            codigo: values.codigo,
            diaVisitaId: values.diaId,
            zonaId: values.zonaId,
            persona: {
                id: undefined,
                celular: values.celular + "",
                fechaNacimiento: this.moment(values.fechaNacimiento).toISOString(),
                email: values.email,
                tipoDocumento: values.tipoDocumento,
                apellidos: values.apellidos,
                genero: values.genero,
                direccion: values.direccion,
                nombre: values.nombre,
                nroDocumento: values.nroDocumento,
                status: undefined,
                isDeleted: undefined,
                updatedAt: undefined,
                createdAt: undefined
            }
        };

        this.spinner.show();
        this.apiService.addCliente(data).subscribe({
            next: (v) => {
                this.spinner.hide();
                this.getData();
                this.cerrarModal('add');
                this.showNotification(
                    'bg-green',
                    'Empleado registrado!!!',
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
