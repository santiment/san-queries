/// <reference types="./user" />
export declare function startSaveDashboardFlow(dashboard: SAN.Queries.Dashboard): Promise<SAN.Queries.Dashboard>;
export declare function startSavePanelFlow(panel: SAN.Queries.Panel, dashboard: SAN.Queries.Dashboard, isNewDashboard?: boolean): Promise<SAN.Queries.DashboardPanel>;
export declare function startRemoveDashboardPanelsFlow(dashboard: SAN.Queries.Dashboard): Promise<void>;
export declare function startSaveFlow(dashboard: SAN.Queries.Dashboard): Promise<{
    id: number;
    title: string;
    description: string;
    isPublic: boolean;
    user?: SAN.Author | undefined;
    panels: SAN.Queries.DashboardPanel[];
    commentsCount: number;
    votedAt: string;
    votes?: {
        userVotes: number;
        totalVoters: number;
        totalVotes: number;
    } | undefined;
    removedPanels: SAN.Queries.DashboardPanel[];
}>;
export declare function startDeleteDashboardFlow(dashboard: SAN.Queries.Dashboard): void;
