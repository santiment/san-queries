export declare function getQueryString(dashboard: SAN.Queries.Dashboard, selectedPanel?: SAN.Queries.DashboardPanel): string;
export declare function getDashboardPath(dashboard: SAN.Queries.Dashboard, selectedPanel?: SAN.Queries.DashboardPanel): string;
export declare function parseSharedUrl(queryString: string): {
    panels?: SAN.Queries.DashboardPanel[];
    selectedPanelId?: number;
};
