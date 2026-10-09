import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { RecordsResponse } from '../../shared/models/record.model';

@Injectable({
  providedIn: 'root'
})
export class Record {
  private readonly apiUrl = `${environment.apiUrl}/records`;

  constructor(private http: HttpClient) {}

  getRecords(): Observable<RecordsResponse> {
    return this.http.get<RecordsResponse>(this.apiUrl);
  }
}