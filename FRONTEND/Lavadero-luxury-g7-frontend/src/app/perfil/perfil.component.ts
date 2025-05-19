import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { MenuComponent } from '../components/menu/menu.component';
import { NavbarComponent } from "../components/navbar/navbar.component";

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [RouterModule, FooterComponent, MenuComponent, NavbarComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent implements OnInit {
  usuario: any = null;

  ngOnInit() {
    const data = localStorage.getItem('usuarioActual');
    if (data) {
      this.usuario = JSON.parse(data);
    }
  }
  cerrarSesion() {
    localStorage.removeItem('usuarioActual');
    window.location.href = '/inicio-sesion'; // o usar this.router.navigate
  }
  
}
