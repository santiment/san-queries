import { getParametersMap } from './../../lib/utils/parameters';
export function shareColumn({ title, formatterId, chartStyle, isHidden, }) {
    const column = { title, chartStyle, formatterId };
    if (isHidden)
        column.isHidden = true;
    return column;
}
export function sharePanelSettings(settings, sql) {
    const { type, layout, xAxisKey, columns } = settings;
    return {
        type,
        xAxisKey,
        layout: layout === null || layout === void 0 ? void 0 : layout.slice(0, 4),
        columns: columns.map(shareColumn),
        parameters: sql.parameters.map(({ type }) => ({ type })),
    };
}
export function sharePanel(panel) {
    const { name, sql, settings } = panel;
    return {
        name,
        sql: Object.assign(Object.assign({}, sql), { parameters: getParametersMap(sql.parameters) }),
        settings: sharePanelSettings(settings, sql),
    };
}
export function shareDashboard(dashboard) {
    return dashboard.panels.map(sharePanel);
}
//# sourceMappingURL=index.js.map