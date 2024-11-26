import { Component } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MatchesTodayComponent } from './matches-today/matches-today.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [NavbarComponent, RouterModule, SidebarComponent, MatchesTodayComponent]
})
export class AppComponent {
  title = 'Seven Goat';
  // Controla si se muestra el contenido principal o los detalles seleccionados
  isViewingDetails = false;

  viewDetails(): void {
    this.isViewingDetails = true;
    window.scrollTo(0, 0); // Asegurarse de que se vea desde arriba
  }

  goBack(): void {
    this.isViewingDetails = false;
  }

}
