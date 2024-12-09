import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
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
  }

  groupFavoritesByStatus(): void {
    const grouped: { status: string; matches: any[] }[] = [
      { status: 'SCHEDULED', matches: [] },
      { status: 'LIVE', matches: [] },
      { status: 'FINISHED', matches: [] },
    ];

    this.favoriteMatches.forEach((match) => {
      if (match.status.includes('Scheduled')) {
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
    this.favoriteMatches = this.favoriteMatches.filter(
      (match) => match.id !== id
    );
    this.saveFavorites();
    this.groupFavoritesByStatus(); // Actualizar agrupación después de eliminar
  }

  removeTeamFromFavorites(id: number): void {
    this.favoriteTeams = this.favoriteTeams.filter((team) => team.id !== id);
    this.saveFavorites();
  }

  saveFavorites(): void {
    localStorage.setItem('favoriteMatches', JSON.stringify(this.favoriteMatches));
    localStorage.setItem('favoriteTeams', JSON.stringify(this.favoriteTeams));
  }
}
