import { ItableColumn, anyObj } from './src/core/table';
import { dertf, rtf } from './src/core/utils';
import { setupTable } from './src/main';

let mockData = Array.from({ length: 12 }).map((_, i) => ({
    title: `col-${i}`,
    prop: `col${i}`,
}));

let operateColumn: ItableColumn = {
    title: '操作',
    prop: 'operate',
    render: {
        renderFun: () => '编辑',
        event: [
            ['click', (row) => { alert(row) }],
            ['mousemove', (row) => { document.body.style.cursor = 'pointer' }, () => { document.body.style.cursor = 'auto' }],
        ],
        size: {
            width: rtf(35),
            height: 50
        }
    },
    width: 200,
}

const tbInstance = setupTable("#l-table", {
    columns: [...mockData, operateColumn],
    columnH: 50,
    selectable: true
});
let data = Array.from({ length: 1000 }).map((_, y) => {
    let obj: anyObj = {};
    [...mockData, operateColumn].forEach(({ prop }, x) => {
        if (prop !== 'selected') {
            obj[prop] = `2233111${x}-${y}`;
        }

    });
    return obj;
});

tbInstance.data = data;