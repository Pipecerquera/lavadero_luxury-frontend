import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FooterComponent } from '../footer/footer.component';
import { MenuComponent } from '../components/menu/menu.component';
import { ReservaService } from '../services/reserva.service';
import { HistorialService } from '../services/historial.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent, MenuComponent, NavbarComponent],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {
  filtros = {
    fechaInicio: '',
    fechaFin: '',
    placa: '',
    documento: '',
    tipoVehiculo: '',
    servicio: ''
  };

  reservasOriginal: any[] = [];  // Lista original sin filtrar
  reservas: any[] = [];          // Lista filtrada para mostrar
  isAdmin: boolean = false;
  userId: number = 0;

  constructor(
    private reservaService: ReservaService,
    private http: HttpClient,
    private historialService: HistorialService
  ) {}

  ngOnInit(): void {
    const rol = localStorage.getItem('rol');
    const id = localStorage.getItem('userId');

    this.isAdmin = rol?.toUpperCase() === 'ADMIN';
    this.userId = id ? Number(id) : 0;

    if (this.isAdmin) {
      this.getAllReservas();
    } else {
      this.getReservasByUser();
    }
  }

  getAllReservas(): void {
    this.reservaService.getReservas().subscribe({
      next: (data) => {
        this.reservasOriginal = data;   // guardo original
        this.reservas = [...data];      // y muestro copia
      },
      error: (err) => console.error('Error cargando reservas:', err)
    });
  }

  getReservasByUser(): void {
    this.historialService.getReservasPorUsuario(this.userId).subscribe({
      next: (data: any[]) => {
        this.reservasOriginal = data.map((reserva) => ({
          ...reserva,
          vehiculo: {
            ...reserva.vehiculo,
            tipo: reserva.vehiculo?.tipo || ''
          },
          metodoPago: reserva.metodoPago || 'No registrado'
        }));
        this.reservas = [...this.reservasOriginal];
      },
      error: (err) => console.error('Error cargando reservas del usuario:', err)
    });
  }

  aplicarFiltros(): void {
    let reservasFiltradas = [...this.reservasOriginal]; // filtro siempre sobre la lista original

    if (this.filtros.fechaInicio) {
      reservasFiltradas = reservasFiltradas.filter(r =>
        new Date(r.fechaReserva) >= new Date(this.filtros.fechaInicio)
      );
    }

    if (this.filtros.fechaFin) {
      reservasFiltradas = reservasFiltradas.filter(r =>
        new Date(r.fechaReserva) <= new Date(this.filtros.fechaFin)
      );
    }

    if (this.filtros.placa) {
      reservasFiltradas = reservasFiltradas.filter(r =>
        r.vehiculo?.placa?.toLowerCase().includes(this.filtros.placa.toLowerCase())
      );
    }

    if (this.filtros.documento) {
      reservasFiltradas = reservasFiltradas.filter(r =>
        r.user?.documento?.toString().includes(this.filtros.documento)
      );
    }

    if (this.filtros.tipoVehiculo) {
      reservasFiltradas = reservasFiltradas.filter(r =>
        r.vehiculo?.tipo === this.filtros.tipoVehiculo
      );
    }

    if (this.filtros.servicio) {
      reservasFiltradas = reservasFiltradas.filter(r =>
        r.servicio === this.filtros.servicio
      );
    }

    this.reservas = reservasFiltradas;
  }

  resetFiltros(): void {
    this.filtros = {
      fechaInicio: '',
      fechaFin: '',
      placa: '',
      documento: '',
      tipoVehiculo: '',
      servicio: ''
    };
    this.reservas = [...this.reservasOriginal]; // regreso lista original al limpiar filtros
  }

  eliminarReserva(id: number): void {
    this.historialService.deleteReserva(id).subscribe({
      next: () => {
        this.reservas = this.reservas.filter((reserva) => reserva.id !== id);
        console.log('Reserva eliminada:', id);
      },
      error: (err) => console.error('Error eliminando reserva:', err)
    });
  }

  actualizarReserva(id: number, reserva: any): void {
    this.historialService.actualizarEstadoReserva(id, reserva).subscribe({
      next: () => {
        this.getAllReservas(); // Actualiza la lista después de la actualización
      },
      error: (err) => console.error('Error actualizando reserva:', err)
    });
  }
}
