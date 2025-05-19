import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { VehiculoService } from '../services/vehiculo.service';
import { ReservaService } from '../services/reserva.service';
import { LavaderoService } from '../services/lavadero.service';

import { NavbarComponent } from '../components/navbar/navbar.component';
import { MenuComponent } from '../components/menu/menu.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-gestionventas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NavbarComponent,
    MenuComponent,
    FooterComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './gestionventas.component.html',
  styleUrls: ['./gestionventas.component.css']
})
export class GestionVentasComponent {
  formulario: FormGroup;
  tiposVehiculo = ['Carro', 'Moto', 'Bus'];
  tiposServicio: string[] = [];
  mensaje: string = '';
  mostrarFactura: boolean = false; // NUEVO
  reservaSeleccionada: any = null;
  metodoPago: string = '';




  constructor(
    private fb: FormBuilder,
    private vehiculoService: VehiculoService,
    private lavaderoService: LavaderoService,
    private router: RouterModule,
    private reservaService: ReservaService
  ) {
    this.formulario = this.fb.group({
      placa: ['', Validators.required],
      tipo: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      servicio: ['', Validators.required],
    });
  }

  ngOnInit(): void { }

  cargarTiposServicioPorVehiculo(tipoVehiculo: string) {
    this.reservaService.getTiposServicio(tipoVehiculo).subscribe({
      next: (data) => this.tiposServicio = data,
      error: (error) => console.error('Error al cargar tipos de servicio:', error)
    });
  }

  registrarVenta(): void {
  const datos = this.formulario.value;

  const vehiculo = {
    placa: datos.placa,
    tipo: datos.tipo,
    marca: datos.marca,
    modelo: datos.modelo,
    
  };

  // Registrar primero el vehículo
  this.vehiculoService.registrarVehiculo(vehiculo).subscribe({
    next: (vehiculoRegistrado) => {
      console.log('Vehículo registrado:', vehiculoRegistrado);

      const fechaActual = new Date().toISOString().split('T')[0]; // formato YYYY-MM-DD

      const reserva = {
        estado: 'pendiente',
        fechaReserva: fechaActual,
        servicio: datos.servicio,
        vehiculo: { id: vehiculoRegistrado.id }
      };

      // Crear la reserva
      this.reservaService.crearReserva(reserva).subscribe({
        next: (res) => {
          this.mensaje = ''; // Limpiar mensaje
          this.reservaSeleccionada = res; // 👈 Asignar reserva para activar Paso 1
          this.mostrarFactura = false;    // Asegurarse que está en Paso 1
          this.tiposServicio = [];
          console.log('Reserva registrada:', res);
        },
        error: (err) => {
          console.error('Error al crear reserva:', err);
          this.mensaje = 'Error al registrar la reserva.';
        }
      });
    },
    error: (err) => {
      console.error('Error al registrar vehículo:', err);
      this.mensaje = 'Error al registrar el vehículo.';
    }
  });
}


  mostrarResumenPago(metodo: string): void {
      if (!this.reservaSeleccionada) return;
    
      // Actualizar el método de pago en la reserva
      this.reservaSeleccionada.metodoPago = metodo; // Asignar el método de pago a la reserva seleccionada
    
      this.reservaService.actualizarMetodoPago(this.reservaSeleccionada.id, metodo).subscribe({
        next: () => {
          this.mostrarFactura = true;
        },
        error: (err) => {
          console.error('Error al guardar el método de pago:', err);
          Swal.fire('Error', 'No se pudo guardar el método de pago', 'error');
        }
      });
    }

nuevaReserva() {
  this.formulario.reset();
  this.reservaSeleccionada = null;
  this.mostrarFactura = false;
  this.metodoPago = '';
  this.mensaje = '';
}


}