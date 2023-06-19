import { anyObj } from './src/core/table';
import { setUpTable } from './src/main';

let mockData = Array.from({ length: 12 }).map((_, i) => ({
    title: `col-${i}`,
    prop: `col${i}`,
}));
const tbInstance = setUpTable("#l-table", {
    column: mockData,
    columnH: 50,
});

let data = Array.from({ length: 1000 }).map((_, y) => {
    let obj: anyObj = {};
    mockData.forEach(({ prop }, x) => {
        obj[prop] = `${x}-${y}`;
    });
    return obj;
});

tbInstance.data = data;