import { HttpClient } from '@angular/common/http';
import id from '@angular/common/locales/id';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  [x: string]: any;

getReservasPorUsuario(userId: number) {
    throw new Error('Method not implemented.');
    return this.http.get<any>(`/api/reservas/usuario/${id}`);

  }
  private apiUrl = 'http://localhost:8080/api/reservas';

  constructor(private http: HttpClient) { }


  getTiposServicio(tipoVehiculo: string): Observable<string[]> {
    return this.http.get<string[]>(`http://localhost:8080/api/reservas/tipos-servicio?tipoVehiculo=${tipoVehiculo}`);
  }

    // Para obtener reservas
getReservas(): Observable<any[]> {
  return this.http.get<any[]>('http://localhost:8080/api/reservas');
}

// Para crear una nueva reserva
crearReserva(reserva: any): Observable<any> {
  return this.http.post('http://localhost:8080/api/reservas/crear', reserva);
}

// Para eliminar una reserva
eliminarReserva(id: number): Observable<any> {
  return this.http.delete(`http://localhost:8080/api/reservas/${id}`);
}

actualizarMetodoPago(idReserva: number, metodo: string) {
  return this.http.put(`http://localhost:8080/api/reservas/${idReserva}/metodo-pago`, metodo, {
    headers: { 'Content-Type': 'application/json' }
  });
}

  // Para obtener una reserva por ID
  getReservaPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  actualizarReserva(reserva: any) {
  return this.http.put<any>(`http://localhost:8080/reservas/${reserva.id}`, reserva);
}
// Método para actualizar el estado de la reserva
  actualizarEstadoReserva(idReserva: number, estado: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/reservas/${idReserva}/estado`, { estado });
  }
  




}
