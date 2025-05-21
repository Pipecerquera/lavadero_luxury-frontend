import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacturaService } from '../services/factura.service';
import { MenuComponent } from '../components/menu/menu.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-historial-ventas',
  templateUrl: './historial-ventas.component.html',
  styleUrls: ['./historial-ventas.component.css'],
  imports: [FooterComponent, CommonModule, MenuComponent, NavbarComponent],
  standalone: true
})
export class HistorialVentasComponent implements OnInit {

  facturas: any[] = [];
  facturaSeleccionada: any = null;
  error: string = '';

  constructor(private facturaService: FacturaService) {}

  ngOnInit(): void {
    this.obtenerFacturas();
  }

  obtenerFacturas(): void {
    this.facturaService.listarFacturas().subscribe({
      next: (data) => {
        console.log('Facturas obtenidas:', data);
        this.facturas = data;
      },
      error: (err) => {
        console.error('Error al obtener facturas', err);
        this.error = 'No se pudieron cargar las facturas.';
      }
    });
  }

  verDetalle(factura: any): void {
    this.facturaSeleccionada = factura;
  }

  cerrarDetalle(): void {
    this.facturaSeleccionada = null;
  }
}
