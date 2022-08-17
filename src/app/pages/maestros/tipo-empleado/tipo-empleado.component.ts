import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-empleado',
  templateUrl: './tipo-empleado.component.html',
  styleUrls: ['./tipo-empleado.component.sass']
})
export class TipoEmpleadoComponent implements OnInit {

  
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  listData: any[]
  rows = [];
  selectedRowData: any;
  data = [];
  timeElapsed = Date.now();
  today = new Date(this.timeElapsed);
  filteredData = [];
  columns = [{name:"nombre"},{name:"descripcion"},{name:"status"}  ];
  editForm: FormGroup;
  register: FormGroup;
  selectedOption: string;
  public loading = false;
  @ViewChild("modalRegistro") modalRegistro: TemplateRef<any>
  modalAddReference: any
  modalEditReference: any

 
  constructor(  private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private modalService: NgbModal,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,) { }

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
  getData() {
    this.apiService.getTipoEmpleado().subscribe((tipos: any[]) => {
      this.listData = tipos
      this.filteredData = tipos;

    })
  }
  ngOnInit() {
   this.getData()
    this.register = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
    this.editForm = this.fb.group({
      id: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      createdAt: [''],
      updatedAt: [''],
      isDeleted: [0],
      status: [1]

    });


  }

  editRow(row, rowIndex, content) {
    console.log(row)
    this.modalEditReference = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });

    this.editForm.setValue({
      id: row.id,
      nombre: row.nombre,
      descripcion: row.descripcion,
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
    Swal.fire({
      title: 'Eliminar Tipo Empleado?',
      text: "Seguro de eliminar Tipo Empleado!",
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
        this.apiService.deleteTipoEmpleado(row.id).subscribe({
          next: (v) => {
            this.spinner.hide();
            this.getData()
            Swal.fire('Eliminado!', 'Tipo Empleado Eliminado.', 'success');
          },
          error: (v) => { this.spinner.hide() }
        })
       
      }
    });


  }

  onEditSave(form: FormGroup) {
    if (form.valid) {
      this.spinner.show()
      this.apiService.editTipoEmpleado(form.value).subscribe({
        next: (v) => {
          this.spinner.hide()
          this.getData()
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
    this.apiService.addTipoEmpleado(this.data).subscribe({
      next: (v) => { this.spinner.hide(); this.getData(); this.cerrarModal('add') },
      error: (v) => {
        this.spinner.hide();
      }
    });
    this.showNotification(
      'bg-green',
      'Tipo Empleado Registrado!!!',
      'bottom',
      'right'
    );
  }
  filterDatatable(event) {
   // console.log(event);
    // get the value of the key pressed and make it lowercase
    const value = event.target.value.toLowerCase();

    // get the amount of columns in the table
    const count = this.columns.length;

    // get the key names of each column in the dataset
    const keys = Object.keys(this.filteredData[0]);

    // assign filtered matches to the active datatable
    this.listData = this.filteredData.filter((item) => {
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
