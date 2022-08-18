import type { CreateDashboardVariables, CreatePanelVariables } from './create';
declare type updateDashboardVariables = CreateDashboardVariables & {
    id: number;
};
export declare const mutateUpdateDashboard: (variables: updateDashboardVariables) => Promise<SAN.Queries.Dashboard>;
declare type UpdateDashboardPanelVariables = CreatePanelVariables & {
    panelId: string;
};
export declare const mutateUpdateDashboardPanel: (variables: UpdateDashboardPanelVariables) => Promise<SAN.Queries.DashboardPanel>;
export {};
