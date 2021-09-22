import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  constructor(private http: HttpClient) {}

  get<T>(
    url: string,
    options?: {
      body?: any;
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      params?:
        | HttpParams
        | {
            [param: string]: string | string[];
          };
      observe?: any;
      reportProgress?: boolean;
      responseType?: 'json' | 'text';
      withCredentials?: boolean;
    }
  ): Observable<any> {
    return this.request<T>('GET', url, options);
  }

  post<T>(
    url: string,
    body?: any,
    options?: {
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      params?:
        | HttpParams
        | {
            [param: string]: string | string[];
          };
      observe?: any;
      reportProgress?: boolean;
      responseType?: 'json' | 'text';
      withCredentials?: boolean;
    }
  ): Observable<any> {
    return this.request<T>('POST', url, { body: body, ...options });
  }

  delete<T>(
    url: string,
    options: {
      body?: any;
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      params?:
        | HttpParams
        | {
            [param: string]: string | string[];
          };
      observe?: any;
      reportProgress?: boolean;
      responseType?: 'json' | 'text';
      withCredentials?: boolean;
    }
  ): Observable<any> {
    return this.request<T>('DELETE', url, options);
  }

  put<T>(
    url: string,
    body: any,
    options?: {
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      params?:
        | HttpParams
        | {
            [param: string]: string | string[];
          };
      observe?: any;
      reportProgress?: boolean;
      responseType?: 'json' | 'text';
      withCredentials?: boolean;
    }
  ): Observable<any> {
    return this.request<T>('PUT', url, { body: body, ...options });
  }

  request<T>(
    method: string,
    url: string,
    options?: {
      body?: any;
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      params?:
        | HttpParams
        | {
            [param: string]: string | string[];
          };
      observe?: any;
      reportProgress?: boolean;
      responseType?: 'json' | 'text';
      withCredentials?: boolean;
    }
  ): Observable<any> {
    return this.http.request(method, url, options);
  }
}
