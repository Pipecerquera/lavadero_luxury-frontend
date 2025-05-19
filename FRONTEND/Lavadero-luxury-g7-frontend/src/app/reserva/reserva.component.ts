import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { Router, RouterModule } from '@angular/router';
import { MenuComponent } from '../components/menu/menu.component';
import { LavaderoService } from '../services/lavadero.service';
import { ReservaService } from '../services/reserva.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VehiculoService } from '../services/vehiculo.service';
import { NavbarComponent } from '../components/navbar/navbar.component';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [RouterModule, FormsModule, FooterComponent, MenuComponent, CommonModule, NavbarComponent],
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css'],
})
export class ReservaComponent implements OnInit {
  vehiculos: any[] = [];
  tiposServicio: string[] = [];
  reservaSeleccionada: any = null;
  metodoPago: string = ''; // NUEVO
  mostrarFactura: boolean = false; // NUEVO

  RegisVehiculo = {
    vehiculo: {
      id: null,
      modelo: '',
    },
    tipo: '',
    fecha: ''
  };

  constructor(
    private ReservaService: ReservaService,
    private lavaderoService: LavaderoService,
    private VehiculoService: VehiculoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarVehiculosUsuario();
  }

  cargarVehiculosUsuario(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.VehiculoService.getVehiculosPorUsuario(userId).subscribe({
        next: (data) => {
          this.vehiculos = data;
        },
        error: () => {
          Swal.fire('Error', 'No se pudieron cargar los vehículos', 'error');
        },
      });
    } else {
      Swal.fire('Error', 'No se encontró el ID del usuario', 'error');
    }
  }

  crearreserva(): void {
    const userId = localStorage.getItem('userId');
    if (!userId || !this.RegisVehiculo.vehiculo.id || !this.RegisVehiculo.tipo || !this.RegisVehiculo.fecha) {
      Swal.fire('Error', 'Debe completar todos los campos: vehículo, servicio y fecha', 'warning');
      return;
    }

    const reserva = {
      estado: 'pendiente',
      fechaReserva: this.RegisVehiculo.fecha,
      servicio: this.RegisVehiculo.tipo,
      user: { id: parseInt(userId) },
      vehiculo: { id: this.RegisVehiculo.vehiculo.id },
    };

    this.ReservaService.crearReserva(reserva).subscribe({
      next: (data) => {
        Swal.fire('Éxito', 'Reserva registrada correctamente', 'success');
        this.reservaSeleccionada = data;
      },
      error: (err) => {
        Swal.fire('Error', err.error || 'No se pudo registrar la reserva', 'error');
      }
    });
  }

  onVehiculoSeleccionado(idVehiculo: number) {
    const vehiculo = this.vehiculos.find(v => v.id === +idVehiculo);
    if (vehiculo) {
      this.RegisVehiculo.vehiculo = vehiculo;
      this.cargarTiposServicioPorVehiculo(vehiculo.tipo);
    }
  }

  cargarTiposServicioPorVehiculo(tipoVehiculo: string) {
    this.ReservaService.getTiposServicio(tipoVehiculo).subscribe({
      next: (data) => this.tiposServicio = data,
      error: (error) => console.error('Error al cargar tipos de servicio:', error)
    });
  }

  mostrarResumenPago(metodo: string): void {
    if (!this.reservaSeleccionada) return;

    this.metodoPago = metodo;

    this.ReservaService.actualizarMetodoPago(this.reservaSeleccionada.id, metodo).subscribe({
      next: () => {
        this.mostrarFactura = true;
      },
      error: (err) => {
        console.error('Error al guardar el método de pago:', err);
        Swal.fire('Error', 'No se pudo guardar el método de pago', 'error');
      }
    });
  }


  nuevaReserva(): void {
    this.RegisVehiculo = {
      vehiculo: { id: null, modelo: '' },
      tipo: '',
      fecha: ''
    };
    this.reservaSeleccionada = null;
    this.metodoPago = '';
    this.mostrarFactura = false;
  }
}
