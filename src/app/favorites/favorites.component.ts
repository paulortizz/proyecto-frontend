import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent {
  
  favoriteMatches: { id: number; name: string }[] = [];
  favoriteTeams: { id: number; name: string }[] = [];


  constructor() {
    this.loadFavorites();
  }

  // Cargar favoritos desde LocalStorage
  loadFavorites() {
    const matches = localStorage.getItem('favoriteMatches');
    const teams = localStorage.getItem('favoriteTeams');
    this.favoriteMatches = matches ? JSON.parse(matches) : [];
    this.favoriteTeams = teams ? JSON.parse(teams) : [];
  }

  // Guardar favoritos en LocalStorage
  saveFavorites() {
    localStorage.setItem('favoriteMatches', JSON.stringify(this.favoriteMatches));
    localStorage.setItem('favoriteTeams', JSON.stringify(this.favoriteTeams));
  }

  // Eliminar un partido de favoritos
  removeMatchFromFavorites(id: number) {
    this.favoriteMatches = this.favoriteMatches.filter(match => match.id !== id);
    this.saveFavorites();
  }

  // Eliminar un equipo de favoritos
  removeTeamFromFavorites(id: number) {
    this.favoriteTeams = this.favoriteTeams.filter(team => team.id !== id);
    this.saveFavorites();
  }
}