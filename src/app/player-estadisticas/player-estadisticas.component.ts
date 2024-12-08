import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FootballService } from '../football.service'; // Servicio para obtener datos
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-player-stats',
  standalone: true,
  templateUrl: './player-estadisticas.component.html',
  imports: [CommonModule],
  styleUrls: ['./player-estadisticas.component.css'],
})
export class PlayerStatsComponent implements OnInit {
  allStats: any[] = []; // Almacena todas las estadísticas
  filteredStats: any[] = []; // Almacena las estadísticas filtradas
  selectedFilter: string = 'all'; // Filtro seleccionado

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly footballService: FootballService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const leagueId = parseInt(params['leagueId'], 10);
      const season = params['season'];
      const teamId = parseInt(params['teamId'], 10);

      if (leagueId && season && teamId) {
        this.loadPlayerStats(leagueId, season, teamId);
      } else {
        console.error('Missing required query parameters: leagueId, season, or teamId');
      }
    });
  }

  // Método para cargar las estadísticas de jugadores
  loadPlayerStats(leagueId: number, season: string, teamId: number): void {
    this.footballService.getPlayerStats(leagueId, season, teamId).subscribe({
      next: (data) => {
        this.allStats = data.data || [];
        this.filterStats('all'); // Por defecto, mostrar todas las estadísticas
      },
      error: (error) => {
        console.error('Error fetching player stats:', error);
      },
    });
  }

  // Método para filtrar estadísticas según el filtro seleccionado
  filterStats(filter: string): void {
    this.selectedFilter = filter;

    switch (filter) {
      case 'goals':
        this.filteredStats = this.allStats
          .filter((player) => player.goals > 0)
          .sort((a, b) => b.goals - a.goals);
        break;
      case 'assists':
        this.filteredStats = this.allStats
          .filter((player) => player.assists > 0)
          .sort((a, b) => b.assists - a.assists);
        break;
      case 'shots':
        this.filteredStats = this.allStats
          .filter((player) => player.shotsOnTarget > 0)
          .sort((a, b) => b.shotsOnTarget - a.shotsOnTarget);
        break;
      case 'yellow':
        this.filteredStats = this.allStats
          .filter((player) => player.yellowCards > 0)
          .sort((a, b) => b.yellowCards - a.yellowCards);
        break;
      case 'red':
        this.filteredStats = this.allStats
          .filter((player) => player.redCards > 0)
          .sort((a, b) => b.redCards - a.redCards);
        break;
      default: // 'all'
        this.filteredStats = [...this.allStats];
        break;
    }
  }
  viewPlayerDetails(playerId: number): void {
    this.router.navigate(['/player-details'], { queryParams: { playerId, season: '2024' } });
  }
  
  
  
}
