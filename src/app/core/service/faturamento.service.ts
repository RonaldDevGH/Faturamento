import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotaFiscal } from '../../shared/models/nota-fiscal.models';

@Injectable({
  providedIn: 'root'
})
export class FaturamentoService {
  private readonly apiUrl = 'http://localhost:5258/api/NotaFiscal';

  constructor(private http: HttpClient) { }

  getFaturamento(): Observable<NotaFiscal[]> {
    return this.http.get<NotaFiscal[]>(this.apiUrl);
  }

  postFaturamento(item: NotaFiscal): Observable<NotaFiscal> {
    return this.http.post<NotaFiscal>(this.apiUrl, item);
  }
}
