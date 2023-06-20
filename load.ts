import { anyObj } from './src/core/table';
import { setupTable } from './src/main';

let mockData = Array.from({ length: 12 }).map((_, i) => ({
    title: `col-${i}`,
    prop: `col${i}`,
}));
const tbInstance = setupTable("#l-table", {
    columns: mockData,
    columnH: 50,
    selectable: true
});
let data = Array.from({ length: 1000 }).map((_, y) => {
    let obj: anyObj = {};
    mockData.forEach(({ prop }, x) => {
        if (prop !== 'selected') {
            obj[prop] = `${x}-${y}`;
        }
    });
    return obj;
});

tbInstance.data = data;