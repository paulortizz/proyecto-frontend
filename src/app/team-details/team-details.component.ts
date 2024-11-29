import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FootballService } from '../football.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team-details',
  standalone: true,
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.css'],
  imports: [CommonModule]
})
export class TeamDetailsComponent implements OnInit {
  team: any = null;
  matches: any[] = [];
  isLoading = true;
  errorMessage = '';
  season: string = new Date().getFullYear().toString(); // Temporada actual

  constructor(
    private readonly route: ActivatedRoute,
    private readonly footballService: FootballService
  ) {}

  ngOnInit(): void {
    const teamId = this.route.snapshot.paramMap.get('id'); // Obtener el ID del equipo desde la URL.

    if (teamId) {
      this.loadTeamDetails(parseInt(teamId, 10));
      this.loadTeamMatches(parseInt(teamId, 10));
    }
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
        this.matches = response.data.playedMatches || [];
      },
      error: (error) => {
        console.error('Error loading team matches:', error);
        this.errorMessage = 'Failed to load team matches.';
      }
    });
  }
}
