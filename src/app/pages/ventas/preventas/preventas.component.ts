import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import * as moment from 'moment';
import {NgxSpinnerService} from 'ngx-spinner';
import {Subscription} from 'rxjs';
import {ApiService} from 'src/services/api.service';

@Component({
    selector: 'app-preventas',
    templateUrl: './preventas.component.html',
    styleUrls: ['./preventas.component.sass']
})
export class PreventasComponent implements OnInit {
    listClientes: any[];
    day: any;

    constructor(private fb: FormBuilder,
                private apiService: ApiService,
                private activeRoute: ActivatedRoute,
                private spinner: NgxSpinnerService,
    ) {
    }

    getDataClientes(usuarioId, numberDay) {
        // console.log('getDataClientes', usuarioId)
        this.apiService.getClientesDisponibles(usuarioId, numberDay)
            .subscribe({
                next: (v: any[]) => {
                    console.log(v);
                    if (v == null) {
                        this.listClientes = [];
                    } else {
                        this.listClientes = v;
                    }
                }
            });
    }


    ngOnInit(): void {

        const usuario = localStorage.getItem('usuario');
        const parseUsuario = JSON.parse(usuario);
        const usuarioId = parseUsuario.id;
        const numberDay = moment().day();
        this.day = numberDay;
        // dia=0 es domingo y continua
        if (numberDay > 0) {
            //cargamos la lista de clientes asignados
            this.getDataClientes(usuarioId, numberDay)
        }
    }

}
