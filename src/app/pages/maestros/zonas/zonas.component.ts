import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import Swal from 'sweetalert2';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
// declare const M: any;
interface Gender {
  id: string;
  value: string;
}
export interface ChipColor {
  name: string;
  color: string;
}
@Component({
  selector: 'app-zonas',
  templateUrl: './zonas.component.html',
  styleUrls: ['./zonas.component.sass']
})
export class ZonasComponent implements OnInit {
  @ViewChild('roleTemplate', { static: true }) roleTemplate: TemplateRef<any>;
  @ViewChild('table') table: DatatableComponent;
  zonas: any[]
  rows = [];
  selectedRowData: selectRowInterface;
  newUserImg = 'assets/images/user/user1.jpg';
  data = [];
  timeElapsed = Date.now();
  today = new Date(this.timeElapsed);
  filteredData = [];
  editForm: FormGroup;
  register: FormGroup;
  selectedOption: string;
  public loading = false;
  @ViewChild("modalRegistro") modalRegistro: TemplateRef<any>
  modalAddReference: any
  modalEditReference: any
  availableColors: ChipColor[] = [
    { name: 'none', color: undefined },
    { name: 'Primary', color: 'primary' },
    { name: 'Accent', color: 'accent' },
    { name: 'Warn', color: 'warn' },

  ];

  columns = [
    { name: 'ID' },
    { name: 'Image' },
    { name: 'First Name' },
    { name: 'Last Name' },
    { name: 'Gender' },
    { name: 'Phone' },
    { name: 'Email' },
    { name: 'Address' }
  ];
  genders = [
    { id: '1', value: 'Male' },
    { id: '2', value: 'Female' }
  ];
  foods = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' }
  ];
  // Table 2
  tb2columns = [
    { name: 'First Name' },
    { name: 'Last Name' },
    { name: 'Address' }
  ];
  tb2data = [];
  tb2filteredData = [];
  @ViewChild(DatatableComponent, { static: false }) table2: DatatableComponent;
  constructor(
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private modalService: NgbModal,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,

  ) {
    this.editForm = this.fb.group({
      id: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      referencia: ['',],
      createdAt: [''],
      updatedAt: [''],
      isDeleted: [0],
      status: [1]

    });
  }

  cerrarModal(type: string) {
    switch (type) {
      case 'add': {
        this.modalAddReference.close();
        this.register.reset()
        break;
      }
      case 'edit': {
        this.modalEditReference.close()
        this.editForm.reset()
      }
    }

  }
  getZonas() {
    this.apiService.getZonas().subscribe((zona: any[]) => {
      this.zonas = zona
      this.filteredData = zona;

    })
  }
  ngOnInit() {
    this.getZonas()
    this.register = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      referencia: ['',],
    });


  }

  editRow(row, rowIndex, content) {
    console.log(row)
    this.modalEditReference = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });

    this.editForm.setValue({
      id: row.id,
      nombre: row.nombre,
      descripcion: row.descripcion,
      referencia: row.referencia,
      createdAt: row.createdAt,
      updatedAt: this.today.toISOString(),
      status: row.status,
      isDeleted: row.isDeleted,
    });
    this.selectedRowData = row;
  }
  addRow(content) {

    this.modalAddReference = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });

  }
  deleteRow(row) {
    console.log(row)

    Swal.fire({
      title: 'Eliminar Zona?',
      text: "Seguro de eliminar zona!",
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        this.spinner.show()
        this.apiService.deleteZona(row.id).subscribe({
          next: (v) => {
            this.spinner.hide();
            this.getZonas()
            Swal.fire('Eliminado!', 'Zona Eliminada.', 'success');
          },
          error: (v) => { this.spinner.hide() }
        })
       
      }
    });


  }

  onEditSave(form: FormGroup) {

    if (form.valid) {
      this.spinner.show()
      this.apiService.editZona(form.value).subscribe({
        next: (v) => {
          this.spinner.hide()
          this.getZonas()
        },
        error: (v) => {
          this.spinner.hide()
        }
      })
      this.showNotification(
        'bg-black',
        'Actualización correcta',
        'bottom',
        'right'
      );
      this.cerrarModal('edit')
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
    this.data = form.value;
    console.log(this.data);
    this.spinner.show()
    this.apiService.addZonas(this.data).subscribe({
      next: (v) => { this.spinner.hide(); this.getZonas(); this.cerrarModal('add') },
      error: (v) => {
        this.spinner.hide();
      }
    });
    this.showNotification(
      'bg-green',
      'Zona Registrada!!!',
      'bottom',
      'right'
    );
  }
  filterDatatable(event) {
    // get the value of the key pressed and make it lowercase
    const value = event.target.value.toLowerCase();

    // get the amount of columns in the table
    const count = this.columns.length;

    // get the key names of each column in the dataset
    const keys = Object.keys(this.filteredData[0]);

    // assign filtered matches to the active datatable
    this.zonas = this.filteredData.filter((item) => {
      // iterate through each row's column data
      for (let i = 0; i <= count; i++) {
        // check for a match
        if (
          (item[keys[i]] &&
            item[keys[i]].toString().toLowerCase().indexOf(value) !== -1) ||
          !value
        ) {
          // found match, return true to add to result set
          return true;
        }
      }
    });

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
export interface selectRowInterface {
  img: String;
  firstName: String;
  lastName: String;
}
