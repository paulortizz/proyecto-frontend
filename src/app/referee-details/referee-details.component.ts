import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FootballService } from '../football.service';
import { CommonModule } from '@angular/common';

interface Referee {
  name: string;
  countryOrOrganization: string;
  matchesArbitrated: number;
  yellowCards: number;
  redCards: number;
  mostCommonStadiums: { [key: string]: number };
  historicalStats: { [season: string]: { matches: number; yellowCards: number; redCards: number } };
  lastFiveMatches: { date: string; home: string; away: string; score: string; stadium: string }[];
}

@Component({
  selector: 'app-referee-details',
  standalone: true,
  templateUrl: './referee-details.component.html',
  styleUrls: ['./referee-details.component.css'],
  imports: [CommonModule]
})
export class RefereeDetailsComponent implements OnInit {
  referee: Referee | null = null; // Usamos la interfaz Referee
  isLoading = true;
  errorMessage = '';
  selectedTab: string = 'statistics'; // Controla las pestañas visibles

  constructor(
    private readonly route: ActivatedRoute,
    private readonly footballService: FootballService
  ) {}

  ngOnInit(): void {
    const refereeName = this.route.snapshot.paramMap.get('name');
    const leagueId = this.route.snapshot.paramMap.get('leagueId');
    const currentYear = new Date().getFullYear().toString();

    if (refereeName && leagueId) {
      this.loadRefereeDetails(parseInt(leagueId, 10), currentYear, refereeName);
    } else {
      this.errorMessage = 'Invalid referee or league data.';
      this.isLoading = false;
    }
  }

  loadRefereeDetails(leagueId: number, season: string, refereeName: string): void {
    this.footballService.getRefereesOverview(leagueId, season).subscribe({
      next: (data) => {
        if (data && data.status === 'success') {
          const referees = data.data || {};
          const allReferees = Object.values(referees).flat() as Referee[]; // Casting explícito
          this.referee = allReferees.find((ref: Referee) => ref.name === refereeName) || null;

          if (!this.referee) {
            this.errorMessage = 'Referee not found.';
          }
        } else {
          this.errorMessage = 'No data available.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching referee details:', error);
        this.errorMessage = 'Failed to load referee details.';
        this.isLoading = false;
      }
    });
  }

  changeTab(tab: string): void {
    this.selectedTab = tab;
  }
}
