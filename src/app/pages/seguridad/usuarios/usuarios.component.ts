import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { RolI } from "../../../../interfaces/RolI";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ApiService } from "../../../../services/api.service";
import { NgxSpinnerService } from "ngx-spinner";
import Swal from "sweetalert2";
import { UsuarioI } from 'src/interfaces/UsuarioI';

@Component({
    selector: 'app-usuarios',
    templateUrl: './usuarios.component.html',
    styleUrls: ['./usuarios.component.sass']
})
export class UsuariosComponent implements OnInit {

    @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
    listData: any[];
    listDataEmpleados: any[];
    rows = [];
    selectedRowData: any;
    data = [];
    listRoles = [];
    timeElapsed = Date.now();
    today = new Date(this.timeElapsed);
    filteredData = [];
    columns = [{ name: "nombre" }, { name: "descripcion" }, { name: "status" }];
    editForm: FormGroup;
    register: FormGroup;
    selectedEmpleado: number;
    selectedRol: number;
    public loading = false;
    @ViewChild("modalRegistro") modalRegistro: TemplateRef<any>;
    modalAddReference: any;
    modalEditReference: any;
    pagination: any;

    constructor(private fb: FormBuilder,
        private _snackBar: MatSnackBar,
        private modalService: NgbModal,
        private apiService: ApiService,
        private spinner: NgxSpinnerService,) {
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

    getData() {
        this.apiService.getUsuarios().subscribe((data: any) => {
            console.log(data)
            this.pagination = data;
            this.listData = data;
            this.filteredData = data;
        });
    }

    getDataRoles() {
        this.apiService.getRoles().subscribe((data: any[]) => {
            this.listRoles = data;
        });
    }

    getDataEmpleados() {
        this.apiService.getEmpleados().subscribe((data: any[]) => {
            this.listDataEmpleados = data;
        });
    }


    ngOnInit() {
        this.getData();
        this.getDataRoles();
        this.register = this.fb.group({
            usuario: ['', Validators.required],
            password: ['', Validators.required],
            rolId: ['', Validators.required],
            personaId: ['', Validators.required],
        });
        this.editForm = this.fb.group({
            id: ['', Validators.required],
            usuario: ['', Validators.required],
            password: ['', Validators.required],
            rolId: ['', Validators.required],
            personaId: ['', Validators.required],
            updatedAt: [''],

        });
        this.getDataEmpleados();
    }

    editRow(row, rowIndex, content) {
        console.log(row);
        this.modalEditReference = this.modalService.open(content, {
            ariaLabelledBy: 'modal-basic-title', backdrop: "static"
        });
        this.selectedEmpleado = row.personaId;
        this.editForm.setValue({
            id: row.id,
            usuario: row.username,
            password: row.password,
            rolId: row.rolId,
            personaId: row.personaId,
            updatedAt: this.today.toISOString(),

        });
        this.selectedRowData = row;
    }

    addRow(content) {
        this.modalAddReference = this.modalService.open(content, {
            ariaLabelledBy: 'modal-basic-title', backdrop: "static"
        });
    }

    deleteRow(row) {
        Swal.fire({
            title: 'Eliminar Usuario?',
            text: "Seguro de Eliminar Usuario!",
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
                this.apiService.deleteUsuario(row.id).subscribe({
                    next: (v) => {
                        this.spinner.hide();
                        this.getData();
                        Swal.fire('Eliminado!', 'Rol Eliminado.', 'success');
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
            const values = form.value;
            // console.log(this.data);
            const data: any = {
                id: values.id,
                username: values.usuario,
                password: values.password,
                personaId: values.personaId,
                rolId: values.rolId,
                updatedAt: this.today.toISOString(),
            };
            console.log(data)
            this.apiService.editUsuario(data).subscribe({
                next: (v) => {
                    this.spinner.hide();
                    this.getData();
                },
                error: (v) => {
                    this.spinner.hide();
                }
            });
            this.showNotification(
                'bg-black',
                'Actualización correcta',
                'bottom',
                'right'
            );
            this.cerrarModal('edit');
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
        // console.log(this.data);
        const data: UsuarioI = {
            username: values.usuario,
            password: values.password,
            personaId: values.personaId,
            rolId: values.rolId
        };
        this.spinner.show();
        this.apiService.addUsuario(data).subscribe({
            next: (v) => {
                this.spinner.hide();
                this.getData();
                this.cerrarModal('add');
                this.showNotification(
                    'bg-green',
                    'Rol Registrado!!!',
                    'bottom',
                    'right'
                );
            },
            error: (v) => {
                this.spinner.hide();
                this.showNotification(
                    'bg-red',
                    v,
                    'bottom',
                    'right'
                );
            }
        });

    }

    filterDatatable(event) {
        // get the value of the key pressed and make it lowercase
        const value = event.target.value.toLowerCase();

        // get the amount of columns in the table
        const count = this.columns.length;

        // get the key names of each column in the dataset
        const keys = Object.keys(this.filteredData[0]);

        // assign filtered matches to the active datatable
        this.listData = this.filteredData.filter((item) => item.username.toLowerCase().indexOf(value) !== -1 ||
            item.persona.nombre.toLowerCase().indexOf(value) !== -1
            || item.persona.apellidos.toLowerCase().indexOf(value) !== -1);

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
