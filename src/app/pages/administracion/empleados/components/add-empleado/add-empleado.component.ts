import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { TipoEmpleadoI } from 'src/interfaces/TipoEmpleadoI';
import { ApiService } from 'src/services/api.service';
import * as moment from "moment";
import { EmpleadoI } from 'src/interfaces/EmpleadoI';
@Component({
  selector: 'app-add-empleado',
  templateUrl: './add-empleado.component.html',
  styleUrls: ['./add-empleado.component.sass']
})
export class AddEmpleadoComponent implements OnInit {
  register: FormGroup;
  public moment = moment;
  listTipoEmpleado: TipoEmpleadoI[];
  selectedTipoEmpleado: any
  constructor(private fb: FormBuilder, private apiService: ApiService, private spinner: NgxSpinnerService, private _snackBar: MatSnackBar,) { }
  getDataTipoEmpleados() {
    this.apiService.getTipoEmpleado()
      .subscribe({
        next: (tipos: TipoEmpleadoI[]) => {
          this.listTipoEmpleado = tipos;
        }
      });
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

    console.log(data);

    this.spinner.show();
    this.apiService.addEmpleado(data).subscribe({
      next: (v) => {
        this.spinner.hide();
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

  showNotification(colorName, text, placementFrom, placementAlign) {
    this._snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }


  ngOnInit(): void {
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
  }

}
