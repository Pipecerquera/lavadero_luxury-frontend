import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MenuComponent } from '../components/menu/menu.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { FacturaService } from '../services/factura.service';

@Component({
  selector: 'app-historial-ventas',
  templateUrl: './historial-ventas.component.html',
  styleUrls: ['./historial-ventas.component.css'],
  standalone: true,
  imports: [FooterComponent, CommonModule, MenuComponent, NavbarComponent, FormsModule]
})
export class HistorialVentasComponent implements OnInit {

  facturas: any[] = [];
  facturasFiltradas: any[] = [];
  facturaSeleccionada: any = null;
  error: string = '';
  fechaBusqueda: string = '';

  ventasDelDia: any[] = [];
  totalVentasDelDia: number = 0;

  constructor(private facturaService: FacturaService) {}

  ngOnInit(): void {
    this.obtenerFacturas();
  }

  obtenerFacturas(): void {
    this.facturaService.listarFacturas().subscribe({
      next: (data) => {
        this.facturas = data;
        this.facturasFiltradas = data;
      },
      error: (err) => {
        console.error('Error al obtener facturas', err);
        this.error = 'No se pudieron cargar las facturas.';
      }
    });
  }

  filtrarPorFecha(): void {
    if (!this.fechaBusqueda) {
      this.facturasFiltradas = this.facturas;
      return;
    }

    const fechaFiltro = new Date(this.fechaBusqueda);
    this.facturasFiltradas = this.facturas.filter(f => {
      const fechaFactura = new Date(f.fechaCreacion);
      return (
        fechaFactura.getUTCFullYear() === fechaFiltro.getUTCFullYear() &&
        fechaFactura.getUTCMonth() === fechaFiltro.getUTCMonth() &&
        fechaFactura.getUTCDate() === fechaFiltro.getUTCDate()
      );
    });
  }

  limpiarFiltro(): void {
    this.fechaBusqueda = '';
    this.facturasFiltradas = this.facturas;
  }

  verDetalle(factura: any): void {
    this.facturaSeleccionada = factura;
  }

  cerrarDetalle(): void {
    this.facturaSeleccionada = null;
  }

  verVentasDelDia(): void {
    const hoy = new Date();
    this.ventasDelDia = this.facturas.filter(f => {
      const fechaFactura = new Date(f.fechaCreacion);
      return (
        fechaFactura.getUTCFullYear() === hoy.getUTCFullYear() &&
        fechaFactura.getUTCMonth() === hoy.getUTCMonth() &&
        fechaFactura.getUTCDate() === hoy.getUTCDate()
      );
    });

    this.totalVentasDelDia = this.ventasDelDia.reduce((acc, curr) => acc + (curr.total || 0), 0);
  }

 exportarVentasDelDiaPDF(): void {
  if (!this.ventasDelDia.length) {
    alert('No hay ventas para exportar.');
    return;
  }

  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text('Ventas del Día', 14, 15);

  const head = [['ID', 'Vehículo', 'Fecha', 'Método de Pago', 'Total']];
  const body = this.ventasDelDia.map(f => [
    f.id,
    f.reserva?.vehiculo?.placa || 'N/A',
    new Date(f.fechaCreacion).toLocaleDateString(),
    f.metodoPago,
    `$${f.total?.toFixed(2)}`
  ]);

  autoTable(doc, {
    head,
    body,
    startY: 25
  });

  doc.setFontSize(12);
  // Posición fija para el total (debajo de la tabla)
  doc.text(`Total Vendido: $${this.totalVentasDelDia.toFixed(2)}`, 14, 80);

  doc.save(`ventas_${new Date().toISOString().split('T')[0]}.pdf`);
}
}
