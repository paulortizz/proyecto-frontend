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
  favoriteMatches: any[] = []; // Cambiado para manejar objetos completos

  constructor(private readonly footballService: FootballService) {}

  ngOnInit(): void {
    this.loadMatchesToday();
    this.loadFavorites();
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

  toggleFavorite(match: any): void {
    const favoriteIndex = this.favoriteMatches.findIndex((fav) => fav.id === match.fixture.id);

    if (favoriteIndex !== -1) {
        // Si ya es favorito, eliminarlo
        this.favoriteMatches.splice(favoriteIndex, 1);
    } else {
        // Si no es favorito, agregarlo
        const favoriteMatch = {
            id: match.fixture.id,
            homeLogo: match.teams.home.logo,
            homeName: match.teams.home.name,
            awayLogo: match.teams.away.logo,
            awayName: match.teams.away.name,
            homeScore: match.goals.home ?? '-',
            awayScore: match.goals.away ?? '-',
            status: this.getMatchStatus(match),
        };
        this.favoriteMatches.push(favoriteMatch);
    }
    this.saveFavorites();
}



isFavorite(matchId: number): boolean {
  return this.favoriteMatches.some((fav) => fav.id === matchId);
}
}
