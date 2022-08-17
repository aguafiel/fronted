import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectConfig } from '@ng-select/ng-select';
import { DatatableComponent, ColumnMode } from '@swimlane/ngx-datatable';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { ClienteI } from 'src/interfaces/ClienteI';
import { EmpleadoI } from 'src/interfaces/EmpleadoI';
import { MultitablaI } from 'src/interfaces/MultitablaI';
import { TipoPersonaI } from 'src/interfaces/TipoPersonaI';
import { ZonaI } from 'src/interfaces/ZonaI';
import { ApiService } from 'src/services/api.service';
import { sunatService } from 'src/services/sunat.service';
import Swal from 'sweetalert2';
import { FormTextOptionsI } from '../../administracion/clientes/add-cliente/add-cliente.component';

@Component({
    selector: 'app-asignaciones',
    templateUrl: './asignaciones.component.html',
    styleUrls: ['./asignaciones.component.sass']
})
export class AsignacionesComponent implements OnInit {
    @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
    listData: any[];

    dataSource: any
    public loading = false;
    @ViewChild("modalRegistro") modalRegistro: TemplateRef<any>;

    public moment = moment;


    displayedColumns: string[] = [
        'id',
        'zona',
        'dia',
        'tipoEmpleado',
        'nombre',
        'nroAsignaciones',
        "opciones"

    ];
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


    constructor(private fb: FormBuilder,
        private apiService: ApiService,
        private spinner: NgxSpinnerService,) {
    }

    getData() {
        this.spinner.show()
        this.apiService.getAsignaciones().subscribe({
            next: (data: any[]) => {

                this.dataSource = new MatTableDataSource(data)
                this.dataSource.paginator = this.paginator;
                this.spinner.hide()
            },
            error: (err: any) => { this.spinner.hide() }
        })
    }
    ngOnInit() {
        this.getData();

    }
}
