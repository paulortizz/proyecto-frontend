import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
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
    private readonly footballService: FootballService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const teamId = params.get('id'); // Obtén el ID del equipo
      if (teamId) {
        this.loadTeamMatches(teamId);
      } else {
        this.errorMessage = 'Team ID not provided.';
        this.isLoading = false;
      }
    });
  }

  loadTeamMatches(teamId: string): void {
    this.isLoading = true; // Mostrar indicador de carga
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

  navigateToMatchDetails(fixtureId: number): void {
    console.log(`Navigating to match details for fixtureId: ${fixtureId}`);
    // Implementar la lógica de navegación si es necesario
  }
}
