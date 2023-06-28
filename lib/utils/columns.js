import { Formatter, FormatType } from './../PanelEditor/Result/Options/format';
export function newColumn(title, i, dateColumns, settings = {}) {
    const accessor = (data) => data[i];
    const column = Object.assign(Object.assign({}, settings), { id: i, title,
        accessor, format: accessor, sortAccessor: accessor });
    const { formatter } = settings || {};
    if (formatter) {
        column.format = (data) => formatter(accessor(data));
    }
    if (dateColumns.has(i)) {
        const { id, fn } = Formatter[FormatType.DATE];
        column.format = (data) => fn(accessor(data));
        column.formatter = fn;
        column.formatterId = id;
        column.sortAccessor = (data) => Date.parse(data[i]);
    }
    return column;
}
export function applyPanelData(panel, data) {
    const { rows, headers, dateColumns } = data;
    const { columns } = panel.settings;
    panel.__rows = rows;
    panel.__computedSql = data;
    panel.settings.columns = headers.map((title, i) => newColumn(title, i, dateColumns, columns[i]));
    return panel;
}
//# sourceMappingURL=columns.js.map