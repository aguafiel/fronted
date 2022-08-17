import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ArrayHelper } from 'src/common/helpers/arrays';
import { ClienteI } from 'src/interfaces/ClienteI';
import { EmpleadoI } from 'src/interfaces/EmpleadoI';
import { MultitablaI } from 'src/interfaces/MultitablaI';
import { TipoPersonaI } from 'src/interfaces/TipoPersonaI';
import { ZonaI } from 'src/interfaces/ZonaI';
import { ApiService } from 'src/services/api.service';
import { sunatService } from 'src/services/sunat.service';
import { FormTextOptionsI } from '../add-cliente/add-cliente.component';
import * as moment from 'moment';
@Component({
  selector: 'app-edit-cliente',
  templateUrl: './edit-cliente.component.html',
  styleUrls: ['./edit-cliente.component.sass']
})
export class EditClienteComponent implements OnInit {

  public cliente: ClienteI
  listEmpleado: EmpleadoI[]
  editForm: FormGroup;
  timeElapsed = Date.now();
  today = new Date(this.timeElapsed);
  formTextFields: FormTextOptionsI;
  selectedTipoPersona: string;
  selectedTipoEmpleado: any
  listTipoPersona: TipoPersonaI[];
  listZonas: ZonaI[];
  moment = moment
  listDias: MultitablaI[];
  listComprobantes: any[];

  constructor(
    private activeRoute: ActivatedRoute,
    private apiService: ApiService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      id: ['', Validators.required],
      nombre: ['', Validators.required],
      tipoPersonaId: ['', Validators.required],
      personaId: ['', Validators.required],
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
      createdAt: [''],
      updatedAt: [''],
      isDeleted: [0],
      status: [1]
    });
  }

  getDataComprobantes() {
    this.apiService.getMultitablasByCode("comprobantes")
      .subscribe((value: any) => {
        this.listComprobantes = value.data;
      });
  }
  getDataPrevendedores() {
    this.apiService.getPrevendedores().subscribe({
      next: (v: EmpleadoI[]) => {
        this.listEmpleado = v
      }
    })
  }

  actualizarCliente(form: FormGroup) {
    if (form.valid) {
      let tipoPersonaFind = ArrayHelper.findDataByProperty(this.listTipoPersona, 'nombre', this.selectedTipoPersona)
      const values = form.value;
      console.log(values);
      const data: ClienteI = {
        id: values.id,
        isDeleted: values.isDeleted,
        createdAt: values.createdAt,
        updatedAt: values.updatedAt,
        personaId: values.personaId,
        status: values.status,
        // tipoPersonaId: values.tipoPersonaId,
        tipoPersonaId: tipoPersonaFind.id,
        nroOrden: values.nroOrden,
        codigo: values.codigo,
        diaVisitaId: values.diaId,
        zonaId: values.zonaId,
        empleadoId: values.empleadoId,
        comprobanteId: values.comprobanteId,
        persona: {
          id: values.personaId,
          celular: values.celular + "",
          fechaNacimiento: this.moment(values.fechaNacimiento, 'DD/MM/YYYY').toISOString(),
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
          createdAt: values.createdAt,
        }
      };
      this.spinner.show();
      this.apiService.editCliente(data).subscribe({
        next: (v) => {
          this.spinner.hide();
          this.showNotification(
            'bg-black',
            'Actualización correcta',
            'bottom',
            'right'
          );
          this.editForm.reset()
          this.router.navigate(['/administracion/clientes'])

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
  showNotification(colorName, text, placementFrom, placementAlign) {
    this._snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  searchDataSunatService() {
    console.log(this.formTextFields)
    const nroDocumento = this.editForm.get("nroDocumento").value;
    sunatService.consultaDatos(nroDocumento, this.formTextFields.isNatural)
      .then(response => response.json())
      .then(data => {
        if (this.formTextFields.isNatural) {
          this.editForm.setValue({
            ...this.editForm.value,
            nombre: data.nombres,
            apellidos: data.apellidoPaterno + ' ' + data.apellidoMaterno,
            direccion: data.direccion,
            tipoDocumento: 'DNI'
          });
        } else {
          this.editForm.setValue({
            ...this.editForm.value,
            nombre: data.nombre,
            apellidos: '',
            direccion: data.direccion,
            tipoDocumento: 'RUC'
          });
        }
      })
      .catch(error => {
        console.log(error);
      });

  }

  getClientesByIdService(id: number) {
    this.apiService.getClientesById(id).subscribe((response: any) => {
      const data =response.data;
      this.cliente = data;
      console.log(data);
      switch (data.tipoPersona.nombre) {
        case 'natural': {
          this.formTextFields.isNatural = true;
          this.formTextFields.isDni = true;
          break;
        }
        case 'juridico': {
          this.formTextFields.isNatural = false;
          this.formTextFields.isDni = false;
          break;
        }
      }

      this.editForm.setValue({
        id: data.id,
        nombre: data.persona.nombre,
        tipoPersonaId: data.tipoPersona.nombre,
        diaId: data.diaVisitaId,
        tipoDocumento: data.persona.tipoDocumento,
        nroDocumento: data.persona.nroDocumento,
        apellidos: data.persona.apellidos,
        genero: data.persona.genero,
        zonaId: data.zonaId,
        personaId: data.persona.id,
        nroOrden: data.nroOrden,
        empleadoId: data.empleadoId,
        comprobanteId: data.comprobanteId,
        fechaNacimiento: data.persona.fechaNacimiento,
        celular: data.persona.celular,
        email: data.persona.email,
        direccion: data.persona.direccion,
        codigo: data.codigo,
        createdAt: data.createdAt,
        updatedAt: this.today.toISOString(),
        isDeleted: data.isDeleted,
        status: data.status

      })
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
  ngOnInit(): void {
    const clientID = this.activeRoute.snapshot.paramMap.get('id')
    console.log(parseInt(clientID));
    this.getClientesByIdService(parseInt(clientID));
    this.getDataDias()
    this.getDataZonas()
    this.getDataTipoCliente()
    this.getDataPrevendedores()
    this.getDataComprobantes()
    //inicializamos el tipo de persona 
    this.formTextFields = { isNatural: true, isDni: true };
  }

}
