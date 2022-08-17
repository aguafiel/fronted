import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectConfig } from '@ng-select/ng-select';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-spinner';
import { map, Observable, startWith } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-submenu',
  templateUrl: './submenu.component.html',
  styleUrls: ['./submenu.component.sass']
})
export class SubmenuComponent implements OnInit {

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  listData: any[]
  rows = [];
  selectedRowData: any;
  data = [];
  timeElapsed = Date.now();
  today = new Date(this.timeElapsed);
  filteredData = [];
  columns = [{name:"nombre"},{name:"descripcion"},{name:"status"},{name:"icono"},{name:"ruta"}  ];
  editForm: FormGroup;
  register: FormGroup;
  selectedOption: string;
  public loading = false;
  @ViewChild("modalRegistro") modalRegistro: TemplateRef<any>
  modalAddReference: any
  modalEditReference: any
  selectedMenu: number;
  public menus:any[]
 options: any[] = [{ name: 'Mary' }, { name: 'Shelley' }, { name: 'Igor' }];
 private _filter(name: string): any[] {
  const filterValue = name.toLowerCase();

  return this.options.filter(
    (option) => option.name.toLowerCase().indexOf(filterValue) === 0
  );
}

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
      this.selectedMenu=null
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
    this.apiService.getSubmenu().subscribe((menu: any[]) => {
      this.listData = menu
      this.filteredData = menu;

    })
  }
  getMenuDescripcion(){
    this.apiService.getMenuDescripcion().subscribe((menu: any[]) =>{
      this.menus=menu;
    })
  }
  ngOnInit() {
   this.getData()
   this.filteredOptions = this.myControl.valueChanges.pipe(
    startWith(''),
    map((value) => (typeof value === 'string' ? value : value.name)),
    map((name) => (name ? this._filter(name) : this.options.slice()))
  );

  

   this.getMenuDescripcion()
    this.register = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      icono: ['',],
      color: ['',],
      style: ['',],
      ruta: ['',],
      menuId:['', Validators.required],
      orden: [1,],
    });
    this.editForm = this.fb.group({
      id: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      icono: ['',],
      color: ['',],
      style: ['',],
      menuId:['', Validators.required],
      ruta: ['',],
      orden: [1,],
      clase:[''],
      createdAt: [''],
      updatedAt: [''],
      isDeleted: [0],
      status: [1]

    });


  }

  editRow(row, rowIndex, content) {
    console.log(row)
    this.modalEditReference = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title',backdrop:'static' });
      this.selectedMenu=row.menuId
    this.editForm.setValue({
      id: row.id,
      nombre: row.nombre,
      descripcion: row.descripcion,
      icono:row.icono,
      ruta:row.ruta,
      color:row.color,
      style:row.style,
      menuId:row.menuId,
      orden:row.orden,
      clase:row.clase,
      createdAt: row.createdAt,
      updatedAt: this.today.toISOString(),
      status: row.status,
      isDeleted: row.isDeleted,
    });
    this.selectedRowData = row;
  }
  addRow(content) {
    this.modalAddReference = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title',backdrop:'static' });
  }
  deleteRow(row) {
    Swal.fire({
      title: 'Eliminar Submenu?',
      text: "Seguro de eliminar Submenu!",
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
        this.apiService.deleteSubmenu(row.id).subscribe({
          next: (v) => {
            this.spinner.hide();
            this.getData()
            Swal.fire('Eliminado!', 'Submenu Eliminado.', 'success');
          },
          error: (v) => { this.spinner.hide() }
        })
       
      }
    });


  }

  onEditSave(form: FormGroup) {
    if (form.valid) {
      this.spinner.show()
      this.apiService.editSubmenu(form.value).subscribe({
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
     const data={
       ...this.data,
       menu:{id:form.get('menuId').value,}
     }
    
    this.spinner.show()
    this.apiService.addSubmenu(this.data).subscribe({
      next: (v) => { this.spinner.hide(); this.getData(); this.cerrarModal('add'); 
       this.showNotification(
        'bg-green',
        'Menu Registrado!!!',
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
