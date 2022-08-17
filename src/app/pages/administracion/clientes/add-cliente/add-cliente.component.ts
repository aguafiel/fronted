import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { TipoEmpleadoI } from 'src/interfaces/TipoEmpleadoI';
import { ApiService } from 'src/services/api.service';
import * as moment from "moment";
import { EmpleadoI } from 'src/interfaces/EmpleadoI';
import { TipoPersonaI } from 'src/interfaces/TipoPersonaI';
import { MultitablaI } from 'src/interfaces/MultitablaI';
import { ZonaI } from 'src/interfaces/ZonaI';
import { sunatService } from "src/services/sunat.service";
import { ArrayHelper } from 'src/common/helpers/arrays';
import { ClienteI } from 'src/interfaces/ClienteI';
import { Router } from '@angular/router';


export interface FormTextOptionsI {
  isNatural: boolean;
  isDni: boolean;
}

@Component({
  selector: 'app-add-cliente',
  templateUrl: './add-cliente.component.html',
  styleUrls: ['./add-cliente.component.sass']
})
export class AddClienteComponent implements OnInit {
  register: FormGroup;
  public moment = moment;
  listTipoEmpleado: TipoEmpleadoI[];
  selectedTipoEmpleado: any
  listTipoPersona: TipoPersonaI[];
  listZonas: ZonaI[];
  listDias: MultitablaI[];
  listEmpleado: EmpleadoI[];
  formTextFields: FormTextOptionsI;
  selectedTipoPersona: string;
  listComprobantes: any[];
  timeElapsed = Date.now();
  today = new Date(this.timeElapsed);

  constructor(private fb: FormBuilder, private apiService: ApiService, private spinner: NgxSpinnerService,
    private _snackBar: MatSnackBar,
    private router: Router) { }


  getDataPrevendedores() {
    this.apiService.getPrevendedores().subscribe({
      next: (v: EmpleadoI[]) => {
        this.listEmpleado = v
      }
    })
  }

  getDataTipoEmpleados() {
    this.apiService.getTipoEmpleado()
      .subscribe({
        next: (tipos: TipoEmpleadoI[]) => {
          this.listTipoEmpleado = tipos;
        }
      });
  }



  searchDataSunatService() {
    console.log(this.formTextFields)
    const nroDocumento = this.register.get("nroDocumento").value;
    sunatService.consultaDatos(nroDocumento, this.formTextFields.isNatural)
      .then(response => response.json())
      .then(data => {
        if (this.formTextFields.isNatural) {
          this.register.setValue({
            ...this.register.value,
            nombre: data.nombres,
            apellidos: data.apellidoPaterno + ' ' + data.apellidoMaterno,
            direccion: data.direccion,
            tipoDocumento: 'DNI'
          });
        } else {
          this.register.setValue({
            ...this.register.value,
            nombre: data.nombre,
            apellidos: '',
            direccion: data.direccion,
            tipoDocumento: 'RUC'
          });
        }
      })
      .catch(error => {
        this.showNotification(
          'bg-red',
          'No se encontró la información solicitada',
          'bottom',
          'right'
        );
        console.log(error);
      });

  }
  handleChangeTipoPersona() {
    let tipoPersonaFind = ArrayHelper.findDataByProperty(this.listTipoPersona, 'nombre', this.selectedTipoPersona)
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


  registrarCliente(form: FormGroup) {
    const values = form.value;
    let tipoPersonaFind = ArrayHelper.findDataByProperty(this.listTipoPersona, 'nombre', this.selectedTipoPersona)
    console.log(tipoPersonaFind)
    const data: ClienteI = {
      id: undefined,
      isDeleted: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      status: undefined,
      // tipoPersonaId: values.tipoPersonaId,
      tipoPersonaId: tipoPersonaFind.id,
      nroOrden: parseInt(values.nroOrden),
      codigo: values.codigo,
      diaVisitaId: values.diaId,
      zonaId: values.zonaId,
      empleadoId: values.empleadoId,
      comprobanteId: values.comprobanteId,
      persona: {
        id: undefined,
        celular: values.celular + "",
        fechaNacimiento: this.moment(values.fechaNacimiento, 'DD/MM/YYYY').toISOString(),
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
        this.showNotification(
          'bg-green',
          'Empleado registrado!!!',
          'bottom',
          'right'
        );
        this.register.reset()
        this.router.navigate(['/administracion/clientes']);

      },
      error: (v) => {
        this.spinner.hide();
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
      .subscribe((value: any) => {
        this.listDias = value.data;
      });
  }

  getDataComprobantes() {
    this.apiService.getMultitablasByCode("comprobantes")
      .subscribe((value: any) => {
        this.listComprobantes = value.data;
      });
  }
  ngOnInit(): void {
    this.getDataComprobantes()
    this.register = this.fb.group({
      nombre: ['', Validators.required],
      tipoPersonaId: ['', Validators.required],
      diaId: ['', Validators.required],
      tipoDocumento: ['', Validators.required],
      nroDocumento: ['', Validators.required],
      empleadoId: ['', Validators.required],
      comprobanteId: ['', Validators.required],
      apellidos: ['',],
      genero: [''],
      zonaId: ['', Validators.required],
      nroOrden: ['', Validators.required],
      fechaNacimiento: [''],
      celular: [''],
      email: [''],
      direccion: [''],
      codigo: [''],

    });
    //inicializamos el tipo de persona 
    this.formTextFields = { isNatural: true, isDni: true };
    //cargamos las listas para las opciones 
    this.getDataTipoCliente();
    this.getDataZonas();
    this.getDataDias();
    this.getDataPrevendedores()
  }

}
