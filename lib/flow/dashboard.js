var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { noop } from 'san-webkit/lib/utils';
import { notifications$ } from 'san-webkit/lib/ui/Notifications';
import { deleteQueryDashboardCache, setQueryDashboardCache } from './../api/dashboard';
import { mutateCreateDashboard, mutateCreateDashboardPanel } from './../api/dashboard/create';
import { mutateRemoveDashboardPanel } from './../api/dashboard/remove';
import { mutateUpdateDashboard, mutateUpdateDashboardPanel } from './../api/dashboard/update';
import { getParametersMap } from './../utils/parameters';
import { myDashboards$ } from './../stores/dashboards';
import { mutateDeleteDashboard } from './../api/dashboard/delete';
import { mutateComputeAndStorePanel } from './../api/query/store';
import { sharePanelSettings } from './../sharing';
export function startSaveDashboardFlow(dashboard) {
    const mutation = dashboard.id ? mutateUpdateDashboard : mutateCreateDashboard;
  const {id, title, description, isPublic} = dashboard
    return mutation({id, title, description, isPublic}).then((updated) => {
        Object.assign(dashboard, updated);
        return dashboard;
    });
}
export function startSavePanelFlow(panel, dashboard, isNewDashboard = false) {
    const { id: dashboardId } = dashboard;
    const { id, name, settings, sql } = panel;
    const mutation = !isNewDashboard && id ? mutateUpdateDashboardPanel : mutateCreateDashboardPanel;
    return mutation({
        dashboardId,
        panelId: isNewDashboard ? undefined : id,
        name,
        sql: {
            query: sql.query,
            parameters: JSON.stringify(getParametersMap(sql.parameters)),
        },
        settings: JSON.stringify(sharePanelSettings(settings, sql)),
    }).then((updated) => {
        panel.id = updated.id;
        mutateComputeAndStorePanel(dashboardId, panel.id).catch(noop);
        return updated;
    });
}
export function startRemoveDashboardPanelsFlow(dashboard) {
    const { id, removedPanels } = dashboard;
    return Promise.all(removedPanels.map((panel) => mutateRemoveDashboardPanel(id, panel.id))).then(() => {
        removedPanels.length = 0;
    });
}
export function startSaveFlow(dashboard) {
    const isNewDashboard = !Number.isFinite(dashboard.id);
    return startSaveDashboardFlow(dashboard)
        .then((_a) => {
        var { __normalized } = _a, dashboard = __rest(_a, ["__normalized"]);
        const removed = new Set(dashboard.removedPanels);
        const panels = dashboard.panels.filter((panel) => !removed.has(panel));
        startRemoveDashboardPanelsFlow(dashboard);
        return Promise.all(panels.map((panel) => startSavePanelFlow(panel, dashboard, isNewDashboard))).then((panels) => {
            dashboard.panels = panels;
            return dashboard;
        });
    })
        .then((dashboard) => {
        setQueryDashboardCache(dashboard.id, dashboard);
        myDashboards$.refetch();
        notifications$.show({
            type: 'success',
            title: 'Dashboard was saved successfully',
        });
        return dashboard;
    })
        .catch((e) => {
        notifications$.show({
            type: 'error',
            title: 'Failed to save the dashboard. Please try again',
        });
        return Promise.reject(e);
    });
}
export function startDeleteDashboardFlow(dashboard) {
    mutateDeleteDashboard(dashboard.id)
        .then(() => {
        deleteQueryDashboardCache(dashboard.id);
        myDashboards$.refetch();
        notifications$.show({
            type: 'success',
            title: 'Dashboard was deleted successfully',
        });
    })
        .catch((e) => {
        notifications$.show({
            type: 'error',
            title: 'Failed to delete the dashboard. Please try again',
        });
        return Promise.reject(e);
    });
}
//# sourceMappingURL=dashboard.js.map
