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
  matches: any[] = []; // Lista completa de partidos
  groupedMatches: { league: any; matches: any[] }[] = []; // Partidos agrupados por liga
  isLoading: boolean = true; // Indicador de carga
  errorMessage: string = ''; // Mensaje de error si ocurre algo
  activeFilter: string = 'all'; // Filtro activo: 'all', 'live', 'finished', 'scheduled'
  expandedLeagues: { [key: number]: boolean } = {}; // Estado de expansión de las ligas

  constructor(private readonly footballService: FootballService) {}

  ngOnInit(): void {
    this.loadMatchesToday(); // Cargar partidos al iniciar el componente
  }

  /**
   * Carga los partidos del día actual desde el servicio
   */
  loadMatchesToday(): void {
    this.footballService.getMatchesToday().subscribe({
      next: (data) => {
        console.log('Partidos cargados:', data);
        this.matches = data.data?.allMatches || []; // Todos los partidos
        this.groupMatchesByLeague(this.matches); // Agrupar partidos inicialmente
        this.isLoading = false; // Finalizar indicador de carga
      },
      error: (error) => {
        console.error('Error al cargar los partidos de hoy:', error);
        this.errorMessage = 'No se pudieron cargar los partidos de hoy.';
        this.isLoading = false; // Finalizar indicador de carga incluso con error
      },
    });
  }

  /**
   * Configura el filtro activo y aplica el filtro
   */
  setFilter(filter: string): void {
    this.activeFilter = filter;
    let filteredMatches: any[] = [];

    switch (filter) {
      case 'live':
      filteredMatches = this.matches.filter(
        (match) =>
          match?.fixture?.status?.short === '1H' || // Primer tiempo
          match?.fixture?.status?.short === '2H' || // Segundo tiempo
          match?.fixture?.status?.short === 'ET' || // Tiempo extra
          match?.fixture?.status?.short === 'P' ||  // Penales
          match?.fixture?.status?.short === 'LIVE' || // En vivo, si existe
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

  /**
   * Agrupa los partidos por liga
   */
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

  /**
   * Alterna la visibilidad de los partidos de una liga
   */
  toggleLeague(leagueId: number): void {
    if (leagueId < 0) return; // Prevenir IDs no válidos
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
        return 'HT'; // Medio tiempo
      case 'FT':
        return 'FT'; // Finalizado
      case 'NS':
        return 'Scheduled'; // Aún no empieza
      default:
        return 'Unknown'; // Por si hay estados desconocidos
    }}
}
