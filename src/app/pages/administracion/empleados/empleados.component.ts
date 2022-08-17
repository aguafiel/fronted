import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ApiService } from "src/services/api.service";
import { NgSelectConfig } from "@ng-select/ng-select";
import { NgxSpinnerService } from "ngx-spinner";
import Swal from "sweetalert2";
import { PersonaI } from "src/interfaces/PersonaI";
import * as moment from "moment";
import { TipoEmpleadoI } from "src/interfaces/TipoEmpleadoI";
import { EmpleadoI } from "src/interfaces/EmpleadoI";

@Component({
    selector: 'app-empleados',
    templateUrl: './empleados.component.html',
    styleUrls: ['./empleados.component.scss']
})
export class EmpleadosComponent implements OnInit {


    @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
    listData: PersonaI[];
    listTipoEmpleado: TipoEmpleadoI[];
    rows = [];
    selectedRowData: PersonaI;
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
    selectedTipoEmpleado: number;


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
        switch (type) {
            case 'add': {
                this.modalAddReference.close();
                this.selectedTipoEmpleado = null;
                this.register.reset();
                break;
            }
            case 'edit': {
                this.modalEditReference.close();
                this.selectedTipoEmpleado = null;
                this.editForm.reset();
            }
        }

    }

    getDataTipoEmpleados() {
        this.apiService.getTipoEmpleado()
            .subscribe({
                next: (tipos: TipoEmpleadoI[]) => {
                    this.listTipoEmpleado = tipos;
                }
            });
    }

    getData() {
        this.apiService.getEmpleados().subscribe((personas: PersonaI[]) => {
            this.listData = personas;
            this.filteredData = personas;

        });
    }

    ngOnInit() {
        this.getData();
        this.getDataTipoEmpleados();
        this.register = this.fb.group({
            nombre: ['', Validators.required],
            tipoEmpleadoId: ['', Validators.required],
            tipoDocumento: ['', Validators.required],
            nroDocumento: ['', Validators.required],
            apellidos: ['', Validators.required],
            genero: ['', Validators.required],
            fechaNacimiento: [''],
            celular: [''],
            email: [''],
            direccion: ['']

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


    }

    editRow(row, rowIndex, content) {
        console.log(row);
        this.modalEditReference = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: "static" });

        this.selectedTipoEmpleado = row.tipoEmpleadoId;
        this.editForm.setValue({
            id: row.id,
            nombre: row.persona.nombre,
            tipoEmpleadoId: row.tipoEmpleadoId,
            tipoDocumento: row.persona.tipoDocumento,
            nroDocumento: row.persona.nroDocumento,
            apellidos: row.persona.apellidos,
            genero: row.persona.genero,
            personaId: row.persona.id,
            fechaNacimiento: this.moment(row.persona.fechaNacimiento).toISOString(),
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
            title: 'Eliminar Empleado?',
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
                this.apiService.deleteEmpleados(row.id).subscribe({
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
                    fechaNacimiento: values.fechaNacimiento,
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

        const data: EmpleadoI = {
            id: undefined,
            isDeleted: undefined,
            createdAt: undefined,
            updatedAt: undefined,
            status: undefined,
            tipoEmpleadoId: values.tipoEmpleadoId,
            persona: {
                id: undefined,
                celular: values.celular + "",
                fechaNacimiento: values.fechaNacimiento,
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

        console.log(data);

        this.spinner.show();
        this.apiService.addEmpleado(data).subscribe({
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
        this.listData = this.filteredData.filter((item) => item.persona.nombre.toLowerCase().indexOf(value) !== -1 || item.persona.apellidos.toLowerCase().indexOf(value) !== -1);

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
