import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:8080/api/producto';

  constructor(private http: HttpClient) {}

  getProductos(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}`);
}


  registrarProducto(producto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar`, producto);
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminar/${id}`);
  }

  obtenerProductoPorId(id: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/${id}`);
}

}
