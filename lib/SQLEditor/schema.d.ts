import { languages } from 'monaco-editor';
import 'monaco-clickhouse/src/basic-languages/clickhouse/clickhouse.contribution';
export declare function getKeywordsSchema(): any;
export declare function getTablesSchema(): Promise<any>;
export declare function getColumnsSchema(): Promise<any>;
export declare function getFunsctionsSchema(): Promise<any>;
export declare function getParametersSchema(parameters: SAN.Queries.PanelParameter[]): {
    label: string;
    insertText: string;
    detail: string;
    kind: languages.CompletionItemKind;
}[];
