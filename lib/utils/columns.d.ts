declare type SharedColumn = Pick<SAN.Queries.Column, 'title' | 'formatterId' | 'isHidden' | 'chartStyle'>;
export declare function shareColumn({ title, formatterId, chartStyle, isHidden, }: SAN.Queries.Column): SharedColumn;
export {};
