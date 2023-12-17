export interface FetchQueryOption {
    page?: number;
    limit?: number;
    skip?: number;
    select?: { [field: string]: 0 | 1 };
    sort?: { [field: string]: -1 | 1 };
}
