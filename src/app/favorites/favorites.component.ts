import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
})
export class FavoritesComponent implements OnInit {
  favoriteMatches: {
    id: number;
    time: string;
    status: string;
    homeLogo: string;
    homeName: string;
    awayLogo: string;
    awayName: string;
    homeScore: number | string;
    awayScore: number | string;
  }[] = [];

  favoriteTeams: { id: number; name: string }[] = [];

  groupedFavorites: { status: string; matches: any[] }[] = [];

  ngOnInit(): void {
    this.loadFavorites();
    this.groupFavoritesByStatus();
  }

  loadFavorites(): void {
    const storedFavorites = localStorage.getItem('favoriteMatches');
    this.favoriteMatches = storedFavorites ? JSON.parse(storedFavorites) : [];
    this.groupFavoritesByStatus();
    console.log('Favoritos cargados:', this.favoriteMatches);
  }

  groupFavoritesByStatus(): void {
    const grouped: { status: string; matches: any[] }[] = [
      { status: 'Not Started', matches: [] },
      { status: 'LIVE', matches: [] },
      { status: 'FT', matches: [] },
    ];
  
    this.favoriteMatches.forEach((match) => {
      if (match.status === 'Not Started' || match.status.includes('Scheduled')) {
        grouped[0].matches.push(match);
      } else if (match.status.includes('LIVE')) {
        grouped[1].matches.push(match);
      } else if (match.status.includes('FT')) {
        grouped[2].matches.push(match);
      }
    });
  
    this.groupedFavorites = grouped.filter((group) => group.matches.length > 0);
  }
  

  removeMatchFromFavorites(id: number): void {
    const initialLength = this.favoriteMatches.length;
    this.favoriteMatches = this.favoriteMatches.filter((match) => match.id !== id);
    this.saveFavorites();
    this.groupFavoritesByStatus(); // Actualizar agrupación después de eliminar
    console.log(`Partido eliminado: ${initialLength - this.favoriteMatches.length > 0}`);
  }

  removeTeamFromFavorites(id: number): void {
    this.favoriteTeams = this.favoriteTeams.filter((team) => team.id !== id);
    this.saveFavorites();
  }

  saveFavorites(): void {
    localStorage.setItem('favoriteMatches', JSON.stringify(this.favoriteMatches));
    localStorage.setItem('favoriteTeams', JSON.stringify(this.favoriteTeams));
  }

  toggleFavorite(match: any): void {
    const existingIndex = this.favoriteMatches.findIndex((fav) => fav.id === match.id);
    if (existingIndex !== -1) {
      // Si ya es favorito, lo eliminamos
      this.favoriteMatches.splice(existingIndex, 1);
    } else {
      // Si no es favorito, lo agregamos
      const favoriteMatch = {
        id: match.id,
        time: match.time || 'N/A',
        status: match.status || 'Scheduled',
        homeLogo: match.homeLogo || 'assets/default-team-logo.png',
        homeName: match.homeName || 'Unknown',
        awayLogo: match.awayLogo || 'assets/default-team-logo.png',
        awayName: match.awayName || 'Unknown',
        homeScore: match.homeScore ?? '-',
        awayScore: match.awayScore ?? '-',
      };
      this.favoriteMatches.push(favoriteMatch);
    }
    this.saveFavorites();
    this.groupFavoritesByStatus();
  }

  isFavorite(matchId: number): boolean {
    return this.favoriteMatches.some((match) => match.id === matchId);
  }
}
