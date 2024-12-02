import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FootballService } from '../football.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team-matches',
  standalone: true,
  templateUrl: './team-matches.component.html',
  styleUrls: ['./team-matches.component.css'],
  imports: [CommonModule], // Agrega CommonModule aquí
})
export class TeamMatchesComponent implements OnInit {
  matchesByLeague: { leagueName: string; leagueLogo: string; matches: any[] }[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly footballService: FootballService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const teamId = params['id']; // ID del equipo desde la URL
      if (teamId) {
        this.loadTeamMatches(teamId);
      }
    });
  }

  loadTeamMatches(teamId: string): void {
    console.log(`Loading matches for team ID: ${teamId}`); // Esto ayuda a depurar
    this.footballService.getAllMatchesByTeam(teamId).subscribe({
      next: (response) => {
        console.log('Matches loaded:', response); // Esto verifica los datos
        this.matchesByLeague = response.data; // Partidos organizados por liga
      },
      error: (error) => {
        console.error('Error fetching matches:', error);
        this.errorMessage = 'Failed to load matches.';
      },
    });
  }
  
}
