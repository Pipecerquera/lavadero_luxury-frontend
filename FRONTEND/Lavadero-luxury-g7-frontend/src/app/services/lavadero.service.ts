import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LavaderoService {
  

  
  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post<any>('http://localhost:8080/api/users/register', usuario);
 }

  private apiUrl = 'http://localhost:8080/api/users'

  constructor(private http: HttpClient) { }


  registrarse(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user)
  }

  

  login(usuario: any): Observable<string> {
    return this.http.post<string>('http://localhost:8080/api/users/login', usuario, { responseType: 'text' as 'json' });
  }

  recuperarContrasena(datos: any): Observable<any> {
    return this.http.post(`http://localhost:8080/api/users/recuperar`, datos, { responseType: 'text' });
  }


}
