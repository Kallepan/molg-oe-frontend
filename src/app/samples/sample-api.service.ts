import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CONSTANTS } from '../config/constants';

const SAMPLES_API_ENDPOINT = `${CONSTANTS.GLOBAL_API_ENDPOINT}/samples/`;
const PRINT_LABEL_API_ENDPOINT = `${CONSTANTS.GLOBAL_API_ENDPOINT}/print_label`;
const TAGESNUMMER_MAX_LENGTH = 10;
/* 
Note: Tagesnummer string should always be of length 10
  Use: substring function()
  */

@Injectable({
  providedIn: 'root'
})
export class SampleAPIService {
  constructor(private http: HttpClient) { }
  printers = CONSTANTS.PRINTERS;

  printLabel(tagesnummer: string, internal_number: string, printerType: "largePrinter" | "smallPrinter"): Observable<HttpResponse<any>> {

    const data = {
      tagesnummer: tagesnummer,
      internal_number: internal_number,
      printer_type: printerType,
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response' as const
    };


    return this.http.post(PRINT_LABEL_API_ENDPOINT, data, httpOptions);
  }

  deleteSample(tagesnummer: string): Observable<HttpResponse<any>> {
    tagesnummer = tagesnummer.substring(0, TAGESNUMMER_MAX_LENGTH)
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response' as const
    };

    return this.http.delete(`${SAMPLES_API_ENDPOINT}${tagesnummer}/`, httpOptions);
  }

  assignRackPosition(tagesnummer: string): Observable<HttpResponse<any>> {
    tagesnummer = tagesnummer.substring(0, TAGESNUMMER_MAX_LENGTH)
    const data = {
      assign_rack: true,
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response' as const
    };

    return this.http.patch(`${SAMPLES_API_ENDPOINT}${tagesnummer}/`, data, httpOptions);
  }

  postDummySample(): Observable<HttpResponse<any>> {
    const data = {
      dummy: true
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response' as const
    };

    return this.http.post(`${SAMPLES_API_ENDPOINT}`, data, httpOptions);
  }

  postSample(tagesnummer: string, assign_rack: boolean = false): Observable<HttpResponse<any>> {
    tagesnummer = tagesnummer.substring(0, TAGESNUMMER_MAX_LENGTH)
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
    tagesnummer = tagesnummer.substring(0, TAGESNUMMER_MAX_LENGTH)
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

  getLatestSamplesByArchive(no_of_items: number): Observable<HttpResponse<any>> {
    const query_params = {
      limit: no_of_items,
      ordering: "-archived_at",
      archived_at__isnull: 'False',
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
