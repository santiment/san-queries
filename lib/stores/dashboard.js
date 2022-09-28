import { writable } from 'svelte/store';
import { PanelType, ParameterType } from './../../lib/types';
import { Formatter } from './../../lib/Result/Options/format';
function newPanel() {
    return {
        name: 'My table',
        settings: { type: PanelType.TABLE, columns: [] },
        sql: {
            query: `SELECT
    dt,
    get_asset_name(asset_id) AS slug,
    get_metric_name(metric_id) AS metric,
    value
FROM daily_metrics_v2 FINAL
WHERE
    asset_id = get_asset_id('bitcoin') AND
    metric_id = get_metric_id('daily_active_addresses') AND
    dt >= toDateTime('2022-01-01 00:00:00')
ORDER BY dt ASC
LIMIT 20`,
            parameters: [],
        },
    };
}
function normalizeColumn({ title, formatterId }, id) {
    const column = { title, formatterId };
    const { fn } = Formatter[formatterId || 0];
    if (fn) {
        const accessor = (data) => data[id];
        column.format = (data) => fn(accessor(data));
        column.formatter = fn;
    }
    return column;
}
function normalizePanel(panel) {
    const { sql } = panel;
    const { query, parameters } = sql;
    const settings = Object.assign({ type: PanelType.TABLE, columns: [] }, panel.settings);
    settings.columns = settings.columns.map(normalizeColumn);
    return Object.assign(Object.assign({}, panel), { settings, sql: {
            query,
            parameters: Object.keys(parameters).map((key, i) => {
                var _a;
                return ({
                    key,
                    value: parameters[key],
                    type: ((_a = settings.parameters) === null || _a === void 0 ? void 0 : _a[i].type) || ParameterType.Text,
                });
            }),
        } });
}
function normalizeDashboard(dashboard) {
    if (!dashboard) {
        return {
            panels: [normalizePanel(newPanel())],
            __normalized: true,
        };
    }
    const { panels, __normalized } = dashboard;
    if (__normalized)
        return dashboard;
    if (panels.length === 0)
        panels.push(newPanel());
    return Object.assign(Object.assign({}, dashboard), { panels: panels.slice(0, 1).map(normalizePanel), __normalized: true });
}
export const Dashboard = (defaultValue) => {
    const { subscribe, set } = writable(normalizeDashboard(defaultValue));
    const store = {
        subscribe,
        set(dashboard) {
            // const { settings, panels } = dashboard
            /*
            if (!settings.sql) {
              settings.sql = ''
              settings.parameters = []
            }
      
            settings.columns = settings.columns || []
      
            dashboard.panels = dashboard.panels.slice(0, 1)
      
      
            if (!panels.length) {
              dashboard.panels.push(newPanel())
            }
      
            panels.forEach((panel) => {
              if (!panel.settings) panel.settings = {} as any
              panel.type = panel.settings.type || panel.type || PanelType.TABLE
            })
            */
            if (!dashboard.removedPanels) {
                dashboard.removedPanels = [];
            }
            console.log(dashboard);
            /*
            if (!dashboard.sql) {
              if (dashboard.panels.length) {
                dashboard.sql = { ...dashboard.panels[0].sql }
              } else {
                dashboard.sql = { query: '', parameters: [] as any }
              }
            }
            */
            set(normalizeDashboard(dashboard));
        },
    };
    return store;
};
//# sourceMappingURL=dashboard.js.map