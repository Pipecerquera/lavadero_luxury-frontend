import { Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { InicioComponent } from './inicio/inicio.component';
import { FooterComponent } from './footer/footer.component';
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component';
import { RegisterComponent } from './registrarse/registrarse.component';
import { PrecioServicioComponent } from './precio-servicio/precio-servicio.component';
import { RegistrarVehiculoComponent } from './registrovehiculo/registrovehiculo.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ReservaComponent } from './reserva/reserva.component';
import { MenuComponent } from './components/menu/menu.component';
import { HistorialComponent } from './historial/historial.component';
import { FacturaComponent } from './factura/factura.component';
import { GestionVentasComponent } from './gestionventas/gestionventas.component';
import { AcercadenosotrosComponent } from './acercadenosotros/acercadenosotros.component';

export const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'header', component: HeaderComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'inicio-sesion', component: InicioSesionComponent },
  { path: 'registrarse', component: RegisterComponent },
  { path: 'precio-servicio', component: PrecioServicioComponent },
  { path: 'registro-vehiculo', component: RegistrarVehiculoComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'reserva', component: ReservaComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'historial', component: HistorialComponent},
  { path: 'factura', component: FacturaComponent },
  { path: 'gestionventas', component: GestionVentasComponent},
  { path: 'nosotros', component: AcercadenosotrosComponent },


];
