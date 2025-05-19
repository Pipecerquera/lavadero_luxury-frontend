import { Component, model, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { LavaderoService } from '../services/lavadero.service';
import { FormsModule, NgModel } from '@angular/forms';
import { subscribeOn } from 'rxjs';
import { FooterComponent } from '../footer/footer.component';
import { MenuComponent } from '../components/menu/menu.component';
import { VehiculoService } from '../services/vehiculo.service';
import { NavbarComponent } from '../components/navbar/navbar.component';

@Component({
  selector: 'app-registrovehiculo',
  standalone: true,
  imports: [RouterModule, FormsModule, FooterComponent, MenuComponent, NavbarComponent],
  templateUrl: './registrovehiculo.component.html',
  styleUrl: './registrovehiculo.component.css'
})


export class RegistrarVehiculoComponent {
  RegisVehiculo = {
    placa: '',
    tipo: '',
    color: '',
    marca: '',
    modelo: '',
    user: {
      id: localStorage.getItem('userId')
    }
  };

  constructor(
    private lavaderoService: LavaderoService, 
    private router: Router,
    private VehiculoService: VehiculoService
  
  ) {}

  registrarVehiculo() {
    this.VehiculoService.registrarVehiculo(this.RegisVehiculo).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Vehículo registrado correctamente', 'success');
        this.router.navigate(['/precio-servicio']);
      },
      error: (err) => {
        Swal.fire('Error', err.error || 'No se pudo registrar el vehículo', 'error');
      }
    });
  }
  
}

