import { Component, OnInit } from '@angular/core';
import { FootballService } from '../football.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-matches-today',
  templateUrl: './matches-today.component.html',
  styleUrls: ['./matches-today.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class MatchesTodayComponent implements OnInit {
  matches: any[] = [];
  groupedMatches: { league: any; matches: any[] }[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  activeFilter: string = 'all';
  expandedLeagues: { [key: number]: boolean } = {};
  favoriteMatches: number[] = []; // IDs de partidos favoritos

  constructor(private readonly footballService: FootballService) {}

  ngOnInit(): void {
    this.loadMatchesToday();
    this.loadFavorites(); // Cargar favoritos desde LocalStorage
  }

  loadMatchesToday(): void {
    this.footballService.getMatchesToday().subscribe({
      next: (data) => {
        console.log('Partidos cargados:', data);
        this.matches = data.data?.allMatches || [];
        this.groupMatchesByLeague(this.matches);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar los partidos de hoy:', error);
        this.errorMessage = 'No se pudieron cargar los partidos de hoy.';
        this.isLoading = false;
      },
    });
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    let filteredMatches: any[] = [];

    switch (filter) {
      case 'live':
        filteredMatches = this.matches.filter(
          (match) =>
            match?.fixture?.status?.short === '1H' ||
            match?.fixture?.status?.short === '2H' ||
            match?.fixture?.status?.short === 'ET' ||
            match?.fixture?.status?.short === 'P' ||
            match?.fixture?.status?.short === 'LIVE' ||
            match?.fixture?.status?.short === 'HT'
        );
        console.log('Partidos en vivo:', filteredMatches);
        break;
      case 'finished':
        filteredMatches = this.matches.filter(
          (match) => match?.fixture?.status?.short === 'FT'
        );
        break;
      case 'scheduled':
        filteredMatches = this.matches.filter(
          (match) => match?.fixture?.status?.short === 'NS'
        );
        break;
      default:
        filteredMatches = [...this.matches];
    }

    this.groupMatchesByLeague(filteredMatches);
  }

  groupMatchesByLeague(matches: any[]): void {
    const grouped = matches.reduce((acc: any, match: any) => {
      const leagueId = match?.league?.id;
      if (!leagueId) return acc;

      if (!acc[leagueId]) {
        acc[leagueId] = { league: match.league, matches: [] };
      }

      acc[leagueId].matches.push(match);
      return acc;
    }, {});

    this.groupedMatches = Object.values(grouped);
  }

  toggleLeague(leagueId: number): void {
    if (leagueId < 0) return;
    this.expandedLeagues[leagueId] = !this.expandedLeagues[leagueId];
  }

  getMatchStatus(match: any): string {
    const status = match?.fixture?.status?.short;
    switch (status) {
      case '1H':
      case '2H':
      case 'ET':
      case 'P':
      case 'LIVE':
        return `LIVE - ${match?.fixture?.status?.elapsed || 0}'`;
      case 'HT':
        return 'HT';
      case 'FT':
        return 'FT';
      case 'NS':
        return 'Scheduled';
      default:
        return 'Unknown';
    }
  }

  // Gestión de favoritos
  loadFavorites(): void {
    const storedFavorites = localStorage.getItem('favoriteMatches');
    this.favoriteMatches = storedFavorites ? JSON.parse(storedFavorites) : [];
  }

  saveFavorites(): void {
    localStorage.setItem('favoriteMatches', JSON.stringify(this.favoriteMatches));
  }

  toggleFavorite(matchId: number): void {
    if (this.favoriteMatches.includes(matchId)) {
      this.favoriteMatches = this.favoriteMatches.filter((id) => id !== matchId);
    } else {
      this.favoriteMatches.push(matchId);
    }
    this.saveFavorites();
  }

  isFavorite(matchId: number): boolean {
    return this.favoriteMatches.includes(matchId);
  }

  
}
