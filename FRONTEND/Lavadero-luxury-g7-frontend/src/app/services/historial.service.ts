import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {
  private apiUrl = 'http://localhost:8080/api/reservas';

  constructor(private http: HttpClient) {}

  // Método para obtener todas las reservas (usado por el admin)
  getReservas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Método para obtener las reservas de un usuario específico
  getReservasPorUsuario(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${userId}`);
  }

  // Método para obtener una reserva por ID
  getReservaById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Método para eliminar una reserva
  deleteReserva(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Método para crear una nueva reserva
  crearReserva(reserva: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, reserva);
  }

  // Para actualizar una reserva
  actualizarEstadoReserva(id: number, estado: string): Observable<any> {
    const body = { estado: estado }; // o simplemente { estado }
    return this.http.put(`${this.apiUrl}/${id}/estado`, body);
  }


}
