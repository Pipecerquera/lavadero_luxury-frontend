import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private apiUrl = 'http://localhost:8080/api/facturas';

  constructor(private readonly http: HttpClient) { }

  generarFactura(factura: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar`, factura);
  }

  listarFacturas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listar`);
  }

  obtenerFacturaPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  // Método para finalizar reserva (cambiar estado a "Finalizado")
  finalizarReserva(idReserva: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/reservas/${idReserva}/estado`, { estado: 'Finalizado' });
  }

  // Método para actualizar estado de reserva a "Pagado" o cualquier otro estado
  actualizarEstadoReserva(idReserva: number, estado: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/reservas/${idReserva}/estado`, { estado });
  }

}
