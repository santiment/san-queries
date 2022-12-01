import { getSEOLinkFromIdAndTitle, parse } from 'san-webkit/lib/utils/url';
import { shareDashboard } from './index';
export function getQueryString(dashboard, selectedPanel) {
    let qs = '?panels=' + encodeURIComponent(JSON.stringify(shareDashboard(dashboard)));
    if (selectedPanel) {
        qs += '&selected=' + dashboard.panels.findIndex((panel) => panel === selectedPanel);
    }
    return qs;
}
export function getDashboardPath(dashboard, selectedPanel) {
    const { id, title } = dashboard;
    const path = getSEOLinkFromIdAndTitle(id, title) + '/';
    return path + ((selectedPanel === null || selectedPanel === void 0 ? void 0 : selectedPanel.id) || '');
}
export function parseSharedUrl(queryString) {
    const shared = parse(queryString);
    try {
        const panels = shared.panels ? JSON.parse(shared.panels) : undefined;
        return { panels, selectedPanelId: +shared.selected };
    }
    catch (e) {
        console.error(e);
        return {};
    }
}
//# sourceMappingURL=url.js.map