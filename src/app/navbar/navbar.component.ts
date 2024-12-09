import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private readonly router: Router) {}
  
  isScrolled = false;
   // Nueva función para navegar a la página de favoritos
   goToFavorites() {
    this.router.navigate(['/favorites']);
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const offset = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = offset > 50; // Cambia a true si se desplaza más de 50px
  }
}
