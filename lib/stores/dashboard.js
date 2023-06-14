import { writable } from 'svelte/store';
import { PanelType, ParameterType } from './../types';
import { Formatter } from './../PanelEditor/Result/Options/format';
export function newPanel(name = 'Default panel title', type = PanelType.TABLE, query = '') {
    return {
        name,
        settings: { type, columns: [] },
        sql: {
            query,
            parameters: [],
        },
    };
}
function normalizeColumn({ title, formatterId, chartStyle }, id) {
    const column = { title, formatterId };
    if (chartStyle) {
        column.chartStyle = chartStyle;
    }
    const { fn } = Formatter[formatterId || 0];
    if (fn) {
        const accessor = (data) => data[id];
        column.format = (data) => fn(accessor(data));
        column.formatter = fn;
    }
    return column;
}
export function normalizePanel(panel) {
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
            removedPanels: [],
            __normalized: true,
        };
    }
    const { panels, __normalized } = dashboard;
    if (__normalized)
        return dashboard;
    if (panels.length === 0)
        panels.push(newPanel());
    return Object.assign(Object.assign({}, dashboard), { panels: panels.map(normalizePanel), removedPanels: [], __normalized: true });
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
            if (dashboard && !dashboard.removedPanels) {
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