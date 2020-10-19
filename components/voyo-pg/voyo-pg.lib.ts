import {Observable} from "rxjs";
export type PaginationBehavior="down"|"refresh"|"init";

export interface PaginationParams{
  currentPage:number;
  behavior:PaginationBehavior;
  info?:any;
  pageSize?:number;
}

export interface PaginationFn<Result>{
  (params:PaginationParams):Observable<Result>;
}

export interface PaginationSetting<Result>{
  isEnd:(p:PaginationParams,r:Result)=>boolean;
  isEmpty:(p:PaginationParams,r:Result)=>boolean;
  isError:(p:PaginationParams,r:Result)=>boolean;
}

