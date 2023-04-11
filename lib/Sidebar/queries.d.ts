import { PanelType } from './../types';
export declare const PremadeDashboards: {
    title: string;
    panels: SAN.Queries.DashboardPanel[];
    votes: {};
}[];
export declare function Dashboard(title: string, panels: {
    name: string;
    query: string;
    type?: PanelType;
    parameters?: SAN.Queries.SQL['parameters'];
}[]): {
    title: string;
    panels: SAN.Queries.DashboardPanel[];
    votes: {};
};
