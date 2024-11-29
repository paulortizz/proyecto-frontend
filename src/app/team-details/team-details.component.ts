import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FootballService } from '../football.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-team-details',
  standalone: true,
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.css'],
  imports: [CommonModule]
})
export class TeamDetailsComponent implements OnInit, OnDestroy {
  team: any = null;
  matches: any[] = [];
  isLoading = true;
  errorMessage = '';
  season: string = new Date().getFullYear().toString(); // Temporada actual
  private routeSub!: Subscription; // Suscripción a cambios en la ruta

  constructor(
    private readonly route: ActivatedRoute,
    private readonly footballService: FootballService
  ) {}

  ngOnInit(): void {
    // Suscribirse a los cambios en los parámetros de la ruta
    this.routeSub = this.route.params.subscribe(params => {
      const teamId = params['id']; // Asegúrate de que 'id' coincide con tu configuración de ruta
      if (teamId) {
        this.isLoading = true; // Reinicia el estado de carga
        this.loadTeamDetails(parseInt(teamId, 10));
        this.loadTeamMatches(parseInt(teamId, 10));
      }
    });
  }

  loadTeamDetails(teamId: number): void {
    this.footballService.getTeamDetails(teamId).subscribe({
      next: (response) => {
        this.team = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading team details:', error);
        this.errorMessage = 'Failed to load team details.';
        this.isLoading = false;
      }
    });
  }

  loadTeamMatches(teamId: number): void {
    this.footballService.getTeamMatches(teamId, this.season).subscribe({
      next: (response) => {
        this.matches = response.data || []; // Ajuste para evitar fallos si no hay partidos
      },
      error: (error) => {
        console.error('Error loading team matches:', error);
        this.errorMessage = 'Failed to load team matches.';
      }
    });
  }

  ngOnDestroy(): void {
    // Cancelar la suscripción al destruir el componente
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
