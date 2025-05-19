import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as bootstrap from 'bootstrap';

import { MenuComponent } from '../components/menu/menu.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FacturaService } from '../services/factura.service';
import { ReservaService } from '../services/reserva.service';
import { HistorialService } from '../services/historial.service';


@Component({
  selector: 'app-factura',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FooterComponent,
    MenuComponent,
    NavbarComponent
  ],
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent implements OnInit {

  reservas: any[] = [];
  reservaSeleccionada: any = null;
  metodoPago: string = '';
  metodosPago: string[] = ['Efectivo', 'Tarjeta', 'Transferencia'];

  // Productos disponibles para el lavadero
  productosLavadero = [
    { nombre: 'Papas', precio: 3000 },
    { nombre: 'Gaseosa', precio: 3500 },
    { nombre: 'Torta', precio: 5000 },
    { nombre: 'Agua', precio: 2000 }
  ];

  reservasOriginal: any[] = [];  // Lista original sin filtrar
  productosSeleccionados: any[] = [];
  detalleProductos: string = '';
  total: number = 0;

  constructor(
    private reservaService: ReservaService,
    private facturaService: FacturaService,
    private route: ActivatedRoute,
    private historialService: HistorialService
  ) {}

  ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  if (id) {
    this.cargarReserva(Number(id));
  }

  this.reservaService.getReservas().subscribe({
    next: (data) => {
      this.reservas = data;
      this.reservasOriginal = [...data]; // ← IMPORTANTE
    },
    error: (err) => console.error('Error cargando reservas:', err)
  });
}


  cargarReserva(id: number = this.reservaSeleccionada): void {
    this.reservaService.getReservaPorId(id).subscribe({
      next: (reserva) => {
        this.reservaSeleccionada = reserva;
      },
      error: (err) => {
        console.error('Error al cargar la reserva:', err);
      }
    });
  }


  calcularTotal(): number {
    if (!this.reservaSeleccionada) return 0;
    const precioServicio = this.reservaSeleccionada.precio;
    // Asegúrate de que "servicio" esté en la reserva
    const totalProductos = this.productosSeleccionados.reduce((acc, prod) => acc + prod.precio, 0);
    return precioServicio + totalProductos;
  }

  getFechaActual(): string {
    return new Date().toLocaleDateString('es-CO');
  }

  limpiarFormulario(): void {
    this.reservaSeleccionada = null;
    this.metodoPago = '';
    this.productosSeleccionados = []; // Limpia los productos seleccionados
    this.detalleProductos = ''; // Si usas este campo en el formulario
  }

  actualizarProductosSeleccionados(event: any, producto: any) {
    if (event.target.checked) {
      this.productosSeleccionados.push(producto);
    } else {
      this.productosSeleccionados = this.productosSeleccionados.filter(
        (p) => p.nombre !== producto.nombre
      );
    }
  }

  getAllReservas(): void {
    this.reservaService.getReservas().subscribe({
  next: (data) => {
    this.reservas = data;
    this.reservasOriginal = [...data]; // ✅ copia la lista original
  },
  error: (err) => console.error('Error cargando reservas:', err)
});

  }

  mostrarDetalle = false;
  mostrarFacturaFinal = false;

  verDetalle(reserva: any) {
    this.reservaSeleccionada = reserva;
    this.mostrarDetalle = true;
    this.mostrarFacturaFinal = false;
  }

  cerrarDetalle() {
    this.mostrarDetalle = false;
    this.reservaSeleccionada = null;
  }

  generarFactura() {
    if (!this.reservaSeleccionada.facturada) {
      const factura = {
        reserva: {
          id: this.reservaSeleccionada.id
        },
        metodoPago: this.metodoPago,
        total: this.calcularTotal(),
        detalleProductos: this.productosSeleccionados.map(p => `${p.nombre}: ${p.precio}`).join(', ')
      };

      this.facturaService.generarFactura(factura).subscribe({
        next: (res) => {
          console.log('Factura registrada:', res);

          // Marcar como facturada en el frontend
          this.reservaSeleccionada.facturada = true;

          // ✅ Usar HistorialService para cambiar el estado a "Pagado"
this.historialService.actualizarEstadoReserva(this.reservaSeleccionada.id, 'Pagado').subscribe({
  next: (r) => console.log('Reserva marcada como pagada:', r),
  error: (e) => console.error('Error al actualizar estado de reserva:', e)
});
          this.mostrarDetalle = false;
          this.mostrarFacturaFinal = true;
        },
        error: (err) => {
          console.error('Error al generar factura:', err);
        }
      });
    }
  }
  exportarPDF(): void {
  const data = document.getElementById('facturaPDF');
  if (!data) return;

  html2canvas(data).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`factura_${this.reservaSeleccionada.id}.pdf`);
  });
}


  cerrarFacturaFinal() {
    this.mostrarFacturaFinal = false;
    this.reservaSeleccionada = null;
    this.metodoPago = null;
    this.productosSeleccionados = [];
  }

  filtros = {
    fechaInicio: '',
    fechaFin: '',
    placa: '',
    documento: '',
    tipoVehiculo: '',
    servicio: ''
  };

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
}
