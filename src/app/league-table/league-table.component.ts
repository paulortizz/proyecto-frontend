import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FootballService } from '../football.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-league-table',
  standalone: true,
  templateUrl: './league-table.component.html',
  styleUrls: ['./league-table.component.css'],
  imports: [CommonModule],
})
export class LeagueTableComponent implements OnInit {
  leagueId: string = '';
  season: string = new Date().getFullYear().toString();
  standings: any[] = [];
  leagueName: string = ''; // Nombre de la liga
  leagueLogo: string = ''; // Logo de la liga
  isLoading = true; // Estado de carga
  errorMessage = ''; // Mensajes de error
  teamName: string = ''; // Nombre del equipo seleccionado

  constructor(
    private readonly route: ActivatedRoute,
    private readonly footballService: FootballService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.leagueId = params['leagueId'];
      this.season = params['season'] || this.season;

      console.log('Received leagueId:', this.leagueId, 'Season:', this.season);

      if (this.leagueId && this.season) {
        this.loadStandings();
      } else {
        this.errorMessage = 'League ID or season missing.';
        this.isLoading = false;
      }
    });

    // Obtener el nombre del equipo seleccionado desde los parámetros de la ruta si es necesario
    this.route.params.subscribe((params) => {
      this.teamName = params['teamName'] || '';
      console.log('Selected team:', this.teamName);
    });
  }

  // Método para cargar los standings
  loadStandings(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.footballService.getStandings2(this.leagueId, this.season).subscribe({
      next: (response) => {
        console.log('Standings response:', response);
        this.standings = response?.data || [];

        if (this.standings.length > 0) {
          // Setear el nombre y logo de la liga basado en el primer equipo
          this.leagueName = 'LaLiga'; // Cambiar si es dinámico
          this.leagueLogo = this.standings[0]?.teamLogo || '';
        } else {
          this.errorMessage = 'No standings available for this league.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching standings:', err);
        this.errorMessage = 'Failed to load standings.';
        this.isLoading = false;
      },
    });
  }

  // Método para obtener la clase de estilo según la posición
  getHighlightClass(position: number): string {
    if (position <= 4) {
      return 'highlight-champions'; // Champions League
    } else if (position <= 6) {
      return 'highlight-europa'; // Europa League
    } else if (position <= 8) {
      return 'highlight-conference'; // Conference League
    } else if (position >= 18) {
      return 'highlight-relegation'; // Relegation Zone
    }
    return ''; // No highlight
  }

  // Método para resaltar el equipo seleccionado
  isSelectedTeam(teamName: string): boolean {
    return this.teamName.toLowerCase() === teamName.toLowerCase();
  }
}
