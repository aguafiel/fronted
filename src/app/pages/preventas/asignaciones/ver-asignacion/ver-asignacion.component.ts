import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute} from '@angular/router';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import * as moment from 'moment';
import {NgxSpinnerService} from 'ngx-spinner';
import {ApiService} from 'src/services/api.service';
import {DragulaService} from 'ng2-dragula';
import {Subscription} from 'rxjs';
import {ArrayHelper} from 'src/common/helpers/arrays';


@Component({
    selector: 'app-ver-asignacion',
    templateUrl: './ver-asignacion.component.html',
    styleUrls: ['./ver-asignacion.component.sass']
})
export class VerAsignacionComponent implements OnInit, OnDestroy {
    @ViewChild(DatatableComponent, {static: false}) table: DatatableComponent;
    data: any = null;
    dataSource: any;
    public loading = false;
    @ViewChild("modalRegistro") modalRegistro: TemplateRef<any>;
    listClientes: any[] = [];
    public moment = moment;


    displayedColumns: string[] = [
        'id',
        'nombre',
        "opciones"
    ];
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    subs = new Subscription();

    constructor(private fb: FormBuilder,
                private apiService: ApiService,
                private activeRoute: ActivatedRoute,
                private spinner: NgxSpinnerService,
                private dragulaService: DragulaService) {

    }

    getData() {
        const clientID = this.activeRoute.snapshot.paramMap.get('id');
        this.spinner.show();
        this.apiService.getDetalleAsignaciones(parseInt(clientID)).subscribe({
            next: (data: any) => {
                this.data = data;
                const detalleAsignaciones = data.detalleAsignaciones;
                this.listClientes = detalleAsignaciones;
                this.spinner.hide();
            },
            error: (err: any) => {
                this.spinner.hide();
            }
        });
    }


    ngOnDestroy() {
    }

    ngOnInit() {
        this.getData();

    }
}
