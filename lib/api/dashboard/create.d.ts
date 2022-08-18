export declare type CreateDashboardVariables = {
    title: string;
    description?: string;
    isPublic?: boolean;
};
export declare const mutateCreateDashboard: (variables: CreateDashboardVariables) => Promise<SAN.Queries.Dashboard>;
export declare type CreatePanelVariables = {
    dashboardId: number;
    name: string;
    description?: string;
    sql: SAN.Queries.SQL;
    settings: any;
};
export declare const mutateCreateDashboardPanel: (variables: CreatePanelVariables) => Promise<SAN.Queries.DashboardPanel>;
