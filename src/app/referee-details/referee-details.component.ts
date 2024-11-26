import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FootballService } from '../football.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-referee-details',
  standalone: true,
  templateUrl: './referee-details.component.html',
  styleUrls: ['./referee-details.component.css'],
  imports: [CommonModule],
})
export class RefereeDetailsComponent implements OnInit {
  referee: any = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly footballService: FootballService
  ) {}

  ngOnInit(): void {
    // Detectar cambios en los parámetros de la ruta
    this.route.paramMap.subscribe((params) => {
      const refereeName = params.get('name');
      const leagueId = params.get('leagueId'); // Liga contextual
      const currentYear = new Date().getFullYear().toString();

      if (refereeName && leagueId) {
        this.loadRefereeDetails(parseInt(leagueId, 10), refereeName, currentYear);
      }
    });
  }

  loadRefereeDetails(leagueId: number, refereeName: string, season: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.referee = null;

    this.footballService.getRefereesOverview(leagueId, season).subscribe({
      next: (data) => {
        if (data && data.status === 'success') {
          const referees = data.data || {}; // Árbitros agrupados por país
          const allReferees = Object.values(referees).flat(); // Convertir grupos en un array plano
          this.referee = allReferees.find((ref: any) => ref.name === refereeName);

          if (!this.referee) {
            this.errorMessage = 'Referee not found.';
          }
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching referee details:', error);
        this.errorMessage = 'Failed to load referee details.';
        this.isLoading = false;
      },
    });
  }
}
