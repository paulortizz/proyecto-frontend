import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FootballService } from '../football.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-team-details',
  standalone: true,
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.css'],
  imports: [CommonModule, RouterModule],
})
export class TeamDetailsComponent implements OnInit, OnDestroy {
  team: any = null; // Información del equipo
  nextMatch: any = null; // Próximo partido
  recentMatches: any[] = []; // Últimos partidos
  matches: any[] = []; // Todos los partidos categorizados por liga (si es necesario)
  isLoading = true;
  errorMessage = '';
  season: string = new Date().getFullYear().toString(); // Temporada actual
  private routeSub!: Subscription; // Suscripción a cambios en la ruta

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly footballService: FootballService
  ) {}

  ngOnInit(): void {
    // Suscribirse a los cambios en los parámetros de la ruta
    this.routeSub = this.route.params.subscribe((params) => {
      const teamId = params['id']; // Obtener ID del equipo de la URL
      if (teamId) {
        this.isLoading = true; // Reinicia el estado de carga
        this.loadTeamOverview(parseInt(teamId, 10));
        this.loadTeamMatches(parseInt(teamId, 10));
      }
    });
  }

  // Cargar información general del equipo
  loadTeamOverview(teamId: number): void {
    this.footballService.getTeamOverview(teamId).subscribe({
      next: (response) => {
        this.team = response.data.team;
        this.nextMatch = response.data.nextMatch;
        this.recentMatches = response.data.recentMatches;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading team overview:', error);
        this.errorMessage = 'Failed to load team overview.';
        this.isLoading = false;
      },
    });
  }

  // Cargar todos los partidos del equipo categorizados por liga
  loadTeamMatches(teamId: number): void {
    this.footballService.getAllMatchesByTeam(teamId.toString()).subscribe({
      next: (response: any) => {
        this.matches = response.data || [];
      },
      error: (error: any) => {
        console.error('Error loading team matches:', error);
        this.errorMessage = 'Failed to load team matches.';
      },
    });
  }

  // Navegar a los detalles de un partido
  navigateToMatchDetails(matchId: number): void {
    this.router.navigate(['/match', matchId]);
  }

  // Navegar a la sección de todos los partidos del equipo
  navigateToAllMatches(): void {
    const teamId = this.team?.id;
    if (teamId) {
      this.router.navigate([`/team/${teamId}/matches`]);
    }
  }

  // Cancelar suscripciones al destruir el componente
  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
