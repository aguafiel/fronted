import {ArrayHelper} from "../helpers/arrays";


export const generateMenu = (menu?) => {
    let arrayNavegacion = [];
    let usuarioLocalStorage: any;
//cargamos Menu en el store
    if (menu) {
        usuarioLocalStorage = menu;
    } else {
        usuarioLocalStorage = JSON.parse(localStorage.getItem("usuario"));
    }
    if (usuarioLocalStorage) {
        arrayNavegacion = usuarioLocalStorage.menus.map(item => {
            const navObject = {
                ...item,
                submenuNavegacion: []
            };
            return navObject;
        });
        usuarioLocalStorage.submenus.forEach(s => {
            const indexArray = ArrayHelper.indexDataByProperty(arrayNavegacion, 'id', s.menuId);
            const findSubmenu = ArrayHelper.findDataByProperty(arrayNavegacion[indexArray].submenuNavegacion, 'id', s.id);
            if (findSubmenu == undefined) {
                arrayNavegacion[indexArray].submenuNavegacion.push(s);
            }
        });
        return arrayNavegacion;
    } else {
        return [];
    }
};