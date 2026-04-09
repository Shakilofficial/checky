/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IQueryParams {
  page?: string | number;
  limit?: string | number;
  searchTerm?: string;
  sort?: string;
  [key: string]: string | number | string[] | undefined;
}

export interface IResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: IMeta | any;
}

export interface IMeta{
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}