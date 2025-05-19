import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../components/menu/menu.component';
import { NavbarComponent } from "../components/navbar/navbar.component";

@Component({
  selector: 'app-precio-servicio',
  standalone: true,
  imports: [RouterModule, FooterComponent, MenuComponent, NavbarComponent],
  templateUrl: './precio-servicio.component.html',
  styleUrl: './precio-servicio.component.css',
})
export class PrecioServicioComponent {}
