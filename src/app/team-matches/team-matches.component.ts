import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FootballService } from '../football.service';

@Component({
  selector: 'app-team-matches',
  standalone: true,
  templateUrl: './team-matches.component.html',
  styleUrls: ['./team-matches.component.css'],
  imports: [CommonModule],
})
export class TeamMatchesComponent implements OnInit {
  matchesByLeague: any[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly footballService: FootballService
  ) {}

  ngOnInit(): void {
    // Escuchar los parámetros de la ruta para obtener el teamId dinámicamente
    this.route.parent?.paramMap.subscribe((params) => {
      const teamId = params.get('id'); // Obtener el ID del equipo desde la URL
      if (teamId) {
        this.loadTeamMatches(teamId);
      } else {
        this.errorMessage = 'Team ID not provided.';
        this.isLoading = false;
      }
    });
  }

  // Método para cargar los partidos de un equipo
  loadTeamMatches(teamId: string): void {
    this.isLoading = true; // Mostrar el indicador de carga
    this.footballService.getTeamMatches2(teamId).subscribe({
      next: (response) => {
        this.matchesByLeague = response?.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching matches:', err);
        this.errorMessage = 'Failed to load matches.';
        this.isLoading = false;
      },
    });
  }

  // Método para navegar a los detalles de un partido (puedes implementarlo si es necesario)
  navigateToMatchDetails(matchId: number): void {
    if (matchId) {
      this.router.navigate(['/match', matchId]);
    }
  }}
