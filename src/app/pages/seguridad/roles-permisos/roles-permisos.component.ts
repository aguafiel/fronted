import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { RolI } from 'src/interfaces/RolI';
import { ApiService } from 'src/services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { ArrayHelper } from "../../../../common/helpers/arrays";


declare var $: any;
declare var fancytree: any;

@Component({
    selector: 'app-roles-permisos',
    templateUrl: './roles-permisos.component.html',
    styleUrls: ['./roles-permisos.component.scss']
})
export class RolesPermisosComponent implements OnInit, AfterViewInit {
    listData: RolI[];
    filteredData = []
    columns = [{ name: "nombre" }, { name: "descripcion" }, { name: "status" }];
    modalAddReference: any;
    modalEditReference: any;
    fancytreeReference: any;
    editForm: FormGroup;
    register: FormGroup;
    dataSource = null;
    listNavigationOrigin = [];
    listNavigation = [];
    stringPermisosOtorgados = [];
    listPermisosOrigin = [];
    listPermisos = [];
    selectedRol: number = null;
    typeModal = '';

    displayedColumns: string[] = [
        'id',
        'nombre',
        'descripcion',
        "opciones"

    ];
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


    constructor(private _snackBar: MatSnackBar,
        private modalService: NgbModal,
        private apiService: ApiService,
        private spinner: NgxSpinnerService) {
    }

    getData() {
        this.apiService.getRoles().subscribe((data: RolI[]) => {
            this.listData = data;
            this.filteredData = data;
            this.dataSource = new MatTableDataSource(data);
            this.dataSource.paginator = this.paginator;
        });
    }

    getDataRolesService() {
        this.apiService.getRoles()
            .subscribe({
                next: (v: any) => {
                    this.listPermisosOrigin = v;
                },
                error: (v: any) => {
                    this.listPermisosOrigin = [];
                }
            });
    }

    getNavegacionPermisoService() {
        this.apiService.getSeguridadNavegacionPermisos()
            .subscribe({
                next: (v: any) => {
                    this.listNavigationOrigin = v;
                },
                error: (v: any) => {
                    console.log(v);
                    this.listNavigation = [];
                }
            });
    }

    cerrarModal(type: string) {
        this.listNavigation = [];
        this.selectedRol = null;
        this.typeModal = '';
        switch (type) {
            case 'add': {
                this.modalAddReference.close();
                break;
            }
            case 'edit': {
                this.modalEditReference.close();
                this.destroyFancyTree();
            }
        }

    }

    ngOnInit(): void {
        this.getDataRolesService();
        this.getData();
        this.getNavegacionPermisoService();
    }

    abrirModal(content, row, type) {
        this.listNavigation = this.listNavigationOrigin;
        this.listPermisos = this.listPermisosOrigin;

        switch (type) {
            case 'add': {
                this.typeModal = 'add';
                this.modalAddReference = this.modalService.open(content, { size: 'lg', backdrop: "static" });
                break;
            }
            case 'edit': {
                this.spinner.show();
                this.typeModal = 'edit';
                this.ObteniendoDatos(content, row);

                break;
            }
        }
    }

    eliminarRol(content, row) {
    }

    ObteniendoDatos(content, row) {
        this.selectedRol = row.id;
        // this.generateFancyTree(null, content);

        this.apiService.getSeguridadByRolId(row.id).subscribe({
            next: (value: any) => {
                const permisos = value.data;
                console.log(permisos);
                this.generateFancyTree(permisos, content);
                this.spinner.hide();

            },
            error: (v: any) => {
                this.spinner.hide();
                console.log(v);
            }
        });
    }

    generateForm() {
        const navMapSubmenu = new Map();
        const navMapMenu = new Map();
        const tree = $("#tree").fancytree('getTree').getSelectedNodes();
        tree.forEach(item => {
            const key = item.key;
            const itemNav = key.split('.');
            const codigo = itemNav[0];
            if (codigo === 's-') {
                let values = navMapSubmenu.get(itemNav[1]);
                if (values != undefined) {
                    const search = ArrayHelper.findDataByProperty(values, 'submenuId', itemNav[2]);
                    if (search == undefined) {
                        navMapSubmenu.set(itemNav[1], [...values, { submenuId: itemNav[2] }]);
                    }
                } else {
                    navMapSubmenu.set(itemNav[1], [{ submenuId: itemNav[2] }]);
                }
                navMapMenu.set(itemNav[1], { menuId: itemNav[1] });
            }
            if (codigo === 'm-') {
                navMapMenu.set(itemNav[1], { menuId: itemNav[1] });
            }
        });
        const listMenus = [...navMapMenu.keys()];
        const newList = listMenus.map(item => {
            const object = {
                menuId: item,
                submenus: navMapSubmenu.get(item) ? navMapSubmenu.get(item) : []
            };
            return object;
        });
        return newList;
    }

    registrarPermisos(type) {
        const newList = this.generateForm();
        if (this.selectedRol && newList.length > 0) {
            const form = {
                rolId: this.selectedRol,
                navegacion: newList
            };
            if (type == 'add') {
                this.spinner.show();
                this.apiService.postSeguridadNavegacionPermisos(form)
                    .subscribe({
                        next: (v: any) => {
                            console.log(v);
                            this.spinner.hide();
                            this.cerrarModal('add');
                            this.getData();
                        },
                        error: (v: any) => {
                            console.log(v);
                            this.spinner.hide();
                        }
                    });
            }
            if (type == 'edit') {
                this.spinner.show();
                this.apiService.postSeguridadNavegacionPermisos(form)
                    .subscribe({
                        next: (v: any) => {
                            this.spinner.hide();
                            this.cerrarModal('edit');
                            this.getData();
                        },
                        error: (v: any) => {
                            this.showNotification('bg-red', v, 'bottom',
                                'right');
                            this.spinner.hide();
                        }
                    });
            }
        } else {
            this.showNotification('bg-red', 'Verificar Campos ...', 'bottom',
                'right');
        }

    }

    generateFancyTree(permisos: any, content) {
        const newFormatFancy = this.listNavigation.map((item: any) => {
            let format: any = {
                title: item.descripcion,
                key: 'm-.' + item.id,
                icon: { addClass: item.icono },
                extraClasses: item.icono,
                expanded: true,
                selected: ArrayHelper.findDataByProperty(permisos.rolesMenus, 'menuId', item.id)

            };
            if (item.submenus.length > 0) {
                format.folder = true;
                format.children = item.submenus.map(sub => {
                    return {
                        title: sub.descripcion,
                        key: 's-.' + item.id + '.' + sub.id,
                        selected: ArrayHelper.findDataByProperty(permisos.rolesSubmenus, 'submenuId', sub.id)
                    };
                });
            }
            return format;
        });
        this.modalEditReference = this.modalService.open(content, { size: 'lg', backdrop: "static" });
        this.fancytreeReference = $("#tree").fancytree({
            source: newFormatFancy,
            selectMode: 3,
            checkbox: true,
            expanded: true,
        });

    }

    destroyFancyTree() {
        $(this.fancytreeReference).fancytree('destroy');
        this.fancytreeReference = undefined;
    }

    ngAfterViewInit(): void {

    }

    showNotification(colorName, text, placementFrom, placementAlign) {
        this._snackBar.open(text, '', {
            duration: 2000,
            verticalPosition: placementFrom,
            horizontalPosition: placementAlign,
            panelClass: colorName
        });
    }

    filterDatatable(event) {
        // get the value of the key pressed and make it lowercase
        const value = event.target.value.toLowerCase();
        console.log(value)
        // get the amount of columns in the table
        const count = this.columns.length;

        // get the key names of each column in the dataset
        const keys = Object.keys(this.filteredData[0]);

        // assign filtered matches to the active datatable
        this.listData = this.filteredData.filter((item) =>
            item.nombre.toLowerCase().indexOf(value) !== -1
            || item.descripcion.toLowerCase().indexOf(value) !== -1);
        console.log(this.listData)
        this.dataSource = new MatTableDataSource(this.listData);
    }

}

