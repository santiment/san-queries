import { Formatter, FormatType } from './../PanelEditor/Result/Options/format';
export function newColumn(title, i, dateColumns) {
    const accessor = (data) => data[i];
    const column = {
        id: i,
        title,
        accessor,
        format: accessor,
        sortAccessor: accessor,
    };
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
    panel.__rows = rows;
    panel.__computedSql = data;
    panel.settings.columns = headers.map((title, i) => newColumn(title, i, dateColumns));
    return panel;
}
//# sourceMappingURL=columns.js.map