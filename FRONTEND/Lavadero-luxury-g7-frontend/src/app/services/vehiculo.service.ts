import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {

  private apiUrl = 'http://localhost:8080/api/vehiculos';

  constructor(private http: HttpClient) { }
  
  registrarVehiculo(vehiculo: any): Observable<any> {
    return this.http.post<any>(`http://localhost:8080/api/vehiculos/registrar`, vehiculo);
  }


  getVehiculosPorUsuario(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/vehiculos/u/${userId}`);
  }

  
}
