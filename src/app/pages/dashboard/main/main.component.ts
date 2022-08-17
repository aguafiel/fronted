import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import * as usuarioSelector from "src/store/selectors/usuario.selector";

import {
    ApexAxisChartSeries,
    ApexChart,
    ApexTooltip,
    ApexPlotOptions,
    ApexDataLabels,
    ApexYAxis,
    ApexXAxis,
    ApexNonAxisChartSeries,
    ApexLegend,
    ApexResponsive,
    ChartComponent,
    ApexFill
} from 'ng-apexcharts';
import {UserI} from 'src/interfaces/UserI';
import {usuarioAction} from "src/store/actions/usuario.action";



@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
    usuario$: Observable<UserI>;
    count$: Observable<number>;

    constructor(private store: Store<any>) {
        this.count$ = store.select('count');
    }

    ngOnInit() {
    }

   

}
