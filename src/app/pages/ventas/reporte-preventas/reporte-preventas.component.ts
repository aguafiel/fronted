import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validator, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import * as moment from 'moment';
import {NgxSpinnerService} from 'ngx-spinner';
import {Subscription} from 'rxjs';
import {ApiService} from 'src/services/api.service';
import {MAT_DATE_LOCALE} from "@angular/material/core";
import {ArrayHelper} from "../../../../common/helpers/arrays";


@Component({
    selector: 'app-reporte-preventas',
    templateUrl: './reporte-preventas.component.html',
    styleUrls: ['./reporte-preventas.component.scss'],

})
export class ReportePreventasComponent implements OnInit {
    listClientes: any[];
    listPrevendedores: any[];
    listReporte: any[];
    listMNC: any[];
    fecha: any;
    fechaFin: any;
    diaNumero: number = 0;
    mapMNC = new Map();
    formFilter: FormGroup;
    resumenTotal = new Map();

    listProductos: any[] = [
        {nombre: '20 LT', nombre2: 'L+E', nombre3: 'S/', codigo: '20-lt+e'},
        {nombre: '20 LT', nombre2: 'LIQ', nombre3: 'S/', codigo: '20-liq'},
        {nombre: '7 LT', nombre2: 'CANT', nombre3: 'S/', codigo: '7-lt'},
        {nombre: 'BONI', nombre2: 'CANT', nombre3: null, codigo: '7-lt-bonus'},
        {nombre: '2.50 LT', nombre2: 'CANT', nombre3: 'S/', codigo: '2.5-lt'},
        {nombre: 'BONI', nombre2: 'CANT', nombre3: null, codigo: '2.5-lt-bonus'},
        {nombre: '0.650 LT', nombre2: 'CANT', nombre3: 'S/', codigo: '650ml'},
        {nombre: 'BONI', nombre2: 'CANT', nombre3: null, codigo: '650-ml-bonus'},
        {nombre: 'OBSERVACIONES', nombre2: null, nombre3: null, codigo: 'observaciones'},
        {nombre: 'MNC', nombre2: null, nombre3: null, codigo: 'mnc'},
    ];

    constructor(private fb: FormBuilder, private apiService: ApiService,
                private activeRoute: ActivatedRoute,
                private spinner: NgxSpinnerService,
    ) {
        this.resumenTotal.set('20lt', {cantidad: 0, subtotal: 0.0, bonificacion: 0});
        this.resumenTotal.set('7lt', {cantidad: 0, subtotal: 0.0, bonificacion: 0});
        this.resumenTotal.set('2.5lt', {cantidad: 0, subtotal: 0.0, bonificacion: 0});
        this.resumenTotal.set('0.650lt', {cantidad: 0, subtotal: 0.0, bonificacion: 0});
        this.fecha = new FormControl(new Date());
        this.formFilter = fb.group({
            empleadoId: ['', Validators.required],
            fecha: [new Date(), Validators.required]
        });
        this.fecha = new FormControl(new Date());
        this.getListMncService();

    }

    getPrevendedoresService() {
        this.apiService.getPrevendedores()
            .subscribe({
                next: (response: any[]) => {
                    this.listPrevendedores = response;
                }
            });
    }

    procesarInformacion(preventa) {
        const detalleAux = preventa.detallePreventa;
        let newFormatDetailPreventa = [
            {nombre: '20 LT', cantidad: 0, tipo: 1, isActive: false, codigo: '20-lt+e', codigo2: '20lt', isBonus: false},
            {nombre: '20 LT', subtotal: 0.0, tipo: 2, isActive: false, codigo: '20-lt+e', codigo2: '20lt', isBonus: false},
            {nombre: '20 LT', cantidad: 0, tipo: 1, isActive: false, codigo: '20-liq', codigo2: '20lt', isBonus: false},
            {nombre: '20 LT', subtotal: 0.0, tipo: 2, isActive: false, codigo: '20-liq', codigo2: '20lt', isBonus: false},
            {nombre: '7 LT', cantidad: 0, tipo: 1, isActive: false, codigo: '7-lt', codigo2: '7lt', isBonus: false},
            {nombre: '7 LT', subtotal: 0.0, tipo: 2, isActive: false, codigo: '7-lt', codigo2: '7lt', isBonus: false},
            {nombre: 'BONI', cantidad: 0, tipo: 1, isActive: false, codigo: '7-lt-bonus', codigo2: '7lt', isBonus: true},
            {nombre: '2.50 LT', cantidad: 0, tipo: 1, isActive: false, codigo: '2.5-lt', codigo2: '2.5lt', isBonus: false},
            {nombre: '2.50 LT', subtotal: 0.0, tipo: 2, isActive: false, codigo: '2.5-lt', codigo2: '2.5lt', isBonus: false},
            {nombre: 'BONI', cantidad: 0, tipo: 1, isActive: false, codigo: '2.5-lt-bonus', codigo2: '2.5lt', isBonus: true},
            {nombre: '0.650 LT', cantidad: 0, tipo: 1, isActive: false, codigo: '650ml', codigo2: '0.650lt', isBonus: false},
            {nombre: '0.650 LT', subtotal: 0.0, tipo: 2, isActive: false, codigo: '650ml', codigo2: '0.650lt', isBonus: false},
            {nombre: 'BONI', cantidad: 0, tipo: 1, isActive: false, codigo: '650-ml-bonus', codigo2: '0.650lt', isBonus: true},
            {nombre: 'OFERTA', cantidad: 0, tipo: 1, isActive: false, codigo: 'oferta-mix'},
            {nombre: 'OBSERVACIONES', tipo: 3, descripcion: preventa.observacion, isActive: true, codigo: 'observaciones'},
            {
                nombre: 'MNC', tipo: 3, descripcion: preventa.mncId != null ? preventa.mnc.codigo : '',
                isActive: preventa.mncId != null ? true : false, codigo: 'mnc'
            }
        ];

        if (preventa.mncId != null) {
            const mnc = this.mapMNC.get(preventa.mnc.codigo);
            let cantidad = mnc.cantidad;
            cantidad++;
            this.mapMNC.set(preventa.mnc.codigo, {cantidad});
        }

        detalleAux.forEach(item => {
            const indexesByProperty = ArrayHelper.indexesDataByProperty(
                newFormatDetailPreventa,
                'codigo',
                item.producto.codigo);
            indexesByProperty.forEach(index => {
                newFormatDetailPreventa[index].isActive = true;
                const resumenObject = this.resumenTotal.get(newFormatDetailPreventa[index].codigo2);
                switch (newFormatDetailPreventa[index].tipo) {
                    case  1: {
                        newFormatDetailPreventa[index].cantidad = item.cantidad;
                        if (newFormatDetailPreventa[index].isBonus) {
                            resumenObject.bonificacion = resumenObject.bonificacion + item.cantidad;
                        } else {
                            resumenObject.cantidad = resumenObject.cantidad + item.cantidad;
                        }
                        break;
                    }
                    case  2: {
                        newFormatDetailPreventa[index].subtotal = item.subtotal;
                        resumenObject.subtotal = resumenObject.subtotal + item.subtotal;
                        break;
                    }
                }
                this.resumenTotal.set(newFormatDetailPreventa[index].codigo2, resumenObject);
            });
        });

        preventa.detallePreventa = newFormatDetailPreventa;
        this.listReporte.push(preventa);
    }

    filtrarInformacion() {
        const {empleadoId, fecha} = this.formFilter.value;
        if (this.formFilter.valid){
            const fechaFormat = moment(fecha).format('YYYY-MM-DD');
            this.resumenTotal.set('20lt', {cantidad: 0, subtotal: 0.0, bonificacion: 0});
            this.resumenTotal.set('7lt', {cantidad: 0, subtotal: 0.0, bonificacion: 0});
            this.resumenTotal.set('2.5lt', {cantidad: 0, subtotal: 0.0, bonificacion: 0});
            this.resumenTotal.set('0.650lt', {cantidad: 0, subtotal: 0.0, bonificacion: 0});
            this.spinner.show();
            this.listReporte = [];
            this.listMNC.forEach(item => {
                this.mapMNC.set(item.codigo, {cantidad: 0});
            });
            this.apiService.getReportePreventasByEmpleadoIdAndFecha(empleadoId, fechaFormat)
                .subscribe({
                    next: (v: any[]) => {
                        this.spinner.hide();
                        console.log(v);
                        v.forEach(item => {
                            this.procesarInformacion(item);
                        });
                    },
                    error: (v: any) => {
                        this.spinner.hide();
                        this.listReporte = [];
                        console.log(v);
                    }
                });
        }
    }

    getListMncService() {
        this.apiService.getMultitablasByCode('mnc')
            .subscribe({
                next: (response: any) => {
                    console.log(response)
                    this.listMNC = response.data;
                    response.data.forEach(item => {
                        this.mapMNC.set(item.codigo, {cantidad: 0});
                    });
                }
            });
    }

    getDataClientes(usuarioId, numberDay) {
        console.log('getDataClientes', usuarioId);
        this.apiService.getDetalleAsignados(usuarioId, 1)
            .subscribe({
                next: (v: any) => {
                    console.log(v);
                    if (v == null) {
                        this.listClientes = [];
                    } else {
                        this.listClientes = v.detalleAsignaciones;
                    }

                }
            });
    }


    ngOnInit(): void {

        const usuario = localStorage.getItem('usuario');
        const parseUsuario = JSON.parse(usuario);
        const usuarioId = parseUsuario.id;
        const numberDay = moment().day();
        this.diaNumero = numberDay;
        this.getPrevendedoresService();
        // dia=0 es domingo y continua
        if (numberDay > 0) {
            //cargamos la lista de clientes asignados
            this.getDataClientes(usuarioId, numberDay);
        }
    }

    getPreventasReportes() {
        const fechaIni = moment(this.fecha, 'MM/DD/YYYY').format('YYYY-MM-DD');

    }

}
