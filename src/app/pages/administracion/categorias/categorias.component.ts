import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectConfig } from '@ng-select/ng-select';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.sass']
})
export class CategoriasComponent implements OnInit {


  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  listData: any[]
  rows = [];
  selectedRowData: any;
  data = [];
  timeElapsed = Date.now();
  today = new Date(this.timeElapsed);
  filteredData = [];
  columns = [{name:"nombre"},{name:"abreviatura"},{name:"status"} ];
  editForm: FormGroup;
  register: FormGroup;
  selectedOption: string;
  public loading = false;
  @ViewChild("modalRegistro") modalRegistro: TemplateRef<any>
  modalAddReference: any
  modalEditReference: any
  selectedMenu: number;
  public menus:any[]


 myControl = new FormControl();
  filteredOptions: Observable<any[]>;
  constructor(  private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private modalService: NgbModal,
    private apiService: ApiService,
    private config: NgSelectConfig,
    private spinner: NgxSpinnerService,) { 
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
  getData() {
    this.apiService.getCategorias().subscribe((menu: any[]) => {
      this.listData = menu
      this.filteredData = menu;

    })
  }

  ngOnInit() {
   this.getData()

    this.register = this.fb.group({
      nombre: ['', Validators.required],
     
    });
    this.editForm = this.fb.group({
      id: ['', Validators.required],
      nombre: ['', Validators.required],
      createdAt: [''],
      updatedAt: [''],
      isDeleted: [0],
      status: [1]

    });


  }

  editRow(row, rowIndex, content) {
  //  console.log(row)
    this.modalEditReference = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });

    this.editForm.setValue({
      id: row.id,
      nombre: row.nombre,
    
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
      title: 'Eliminar Categoria?',
      text: "Seguro de eliminar !!",
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
        this.apiService.deleteCategoria(row.id).subscribe({
          next: (v) => {
            this.spinner.hide();
            this.getData()
            Swal.fire('Eliminado!', 'Registro Eliminado.', 'success');
          },
          error: (v) => { this.spinner.hide() }
        })
       
      }
    });


  }

  onEditSave(form: FormGroup) {
    if (form.valid) {
      this.spinner.show()
      this.apiService.editCategoria(form.value).subscribe({
        next: (v) => {
          this.spinner.hide()
          this.getData();
          this.showNotification(
            'bg-black',
            'Actualización correcta',
            'bottom',
            'right'
          );
          this.cerrarModal('edit')
        },
        error: (v) => {
          this.spinner.hide()
        }
      })
    
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
  
    
    this.spinner.show()
    this.apiService.addCategoria(this.data).subscribe({
      next: (v) => { this.spinner.hide(); this.getData(); this.cerrarModal('add'); 
       this.showNotification(
        'bg-green',
        'Categoria Registrada!!!',
        'bottom',
        'right'
      ); },
      error: (v) => {
        this.spinner.hide();
      }
    });
  
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
