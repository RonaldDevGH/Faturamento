import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto } from '../../shared/models/produto.models';

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {
  private readonly apiUrl = 'http://localhost:5257/api/Produto';

  constructor(private http: HttpClient) { }

  getEstoque(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl);
  }

  postEstoque(item: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, item);
  }

  putEstoque(itens: Produto[]): Observable<Produto[]> {
    return this.http.put<Produto[]>(this.apiUrl, itens);
  }

  getProdutoById(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`);
  }
}
