import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CONSTANTS } from '../config/constants';

const SAMPLES_API_ENDPOINT = `${CONSTANTS.GLOBAL_API_ENDPOINT}/samples/`

@Injectable({
  providedIn: 'root'
})
export class SampleAPIService {

  constructor(private http: HttpClient) { }

  assignRackPosition(tagesnummer: string, assign_rack: boolean): Observable<HttpResponse<any>> {
    const data = {
      assign_rack: assign_rack,
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response' as const
    };

    return this.http.patch(SAMPLES_API_ENDPOINT, data, httpOptions);
  }


  postSample(tagesnummer: string, assign_rack: boolean = false): Observable<HttpResponse<any>> {
    const data = {
      tagesnummer: tagesnummer,
      assign_rack: assign_rack,
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response' as const
    };

    return this.http.post(SAMPLES_API_ENDPOINT, data, httpOptions);
  }

  getSampleByTagesnummer(tagesnummer: string): Observable<HttpResponse<any>> {
    const params = {
      tagesnummer: tagesnummer,
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response' as const,
      params: new HttpParams({
        fromObject: params,
      })
    };

    return this.http.get(SAMPLES_API_ENDPOINT, httpOptions);
  }

  getSampleByInternalNumber(sample_no: string, month: string, year: string): Observable<HttpResponse<any>> {
    const query_params = {
      month: parseInt(month),
      sample_no: parseInt(sample_no),
      year: parseInt(year),
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response' as const,
      params: new HttpParams({
        fromObject: query_params,
      })
    };

    return this.http.get(SAMPLES_API_ENDPOINT, httpOptions);
  }

  getLatestSamples(no_of_items: number): Observable<HttpResponse<any>> {
    const query_params = {
      limit: no_of_items,
      ordering: "-created_at"
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response' as const,
      params: new HttpParams({
        fromObject: query_params,
      })
    };

    return this.http.get(SAMPLES_API_ENDPOINT, httpOptions);
  }
}
