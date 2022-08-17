export const ArrayHelper = {
    findDataByProperty: (listData: any[], property: string, value: any) => {
        return listData.find(x => x[property] === value);
    },
    findIndexByProperty: (listData: any[], property: string, value: any) => {
        let index = -1;
        listData.forEach((x, i) => {
            if (x[property] === value) {
                index = i;
            }
        });
        return index;
    },
    indexDataByProperty: (listData: any[], property: string, value: any) => {
        return listData.findIndex(x => x[property] === value);
    },
    indexesDataByPropertyTwo: (listData: any[], property: string, propertyTwo: any, value: any, valueTwo: any) => {
        const listIndex = [];
        return listData.forEach((x, index) => {
            if (x[property] === value && x[propertyTwo] === valueTwo) {
                listIndex.push(index);
            }
        });
    },
    indexesDataByProperty: (listData: any[], property: string, value: any) => {
        const listIndex = [];
        listData.forEach((x, index) => {
            if (x[property] === value) {
                listIndex.push(index);
            }
        });
        return listIndex;
    },
    filtrarPorCodigo(listData: any[], property: string, value: any) {
        return listData.filter(x => x[property] === value);
    },
    mayorValor: (array: any[]) => {
        let index = 0;
        array.forEach(x => {
            if (x > index) {
                index = x;
            }
        });
        return index;
    }
};
