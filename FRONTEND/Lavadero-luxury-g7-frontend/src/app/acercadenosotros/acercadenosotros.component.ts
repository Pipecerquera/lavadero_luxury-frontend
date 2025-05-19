import { Component } from '@angular/core';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { MenuComponent } from '../components/menu/menu.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-acercadenosotros',
  standalone: true,
  imports: [MenuComponent, FooterComponent, NavbarComponent],
  templateUrl: './acercadenosotros.component.html',
  styleUrls: ['./acercadenosotros.component.css']
})
export class AcercadenosotrosComponent {
  titulo = 'Lavadero Luxury';
  descripcion = 'En Lavadero Luxury nos especializamos en el cuidado integral de tu vehículo. Ofrecemos un servicio de limpieza y mantenimiento detallado para automóviles, motos y buses, garantizando excelencia y satisfacción.';
  mision = 'Brindar un servicio de lavado de vehículos con altos estándares de calidad, eficiencia y atención personalizada, garantizando la satisfacción total de nuestros clientes.';
  vision = 'Ser reconocidos como el mejor lavadero de vehículos a nivel regional, destacando por la excelencia en el servicio, innovación tecnológica y compromiso con el medio ambiente.';
}
