import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FootballService } from '../football.service';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-match-details',
  standalone: true,
  templateUrl: './match-details.component.html',
  styleUrls: ['./match-details.component.css'],
  imports: [CommonModule],
})
export class MatchDetailsComponent implements OnInit {
  matchDetails: any = null; // Información del partido
  lineups: any[] = []; // Alineaciones del partido
  isLoading: boolean = true; // Estado de carga
  errorMessage: string = ''; // Mensaje de error
  activeTab: string = 'events'; // Pestaña activa
  combinedStatistics: any[] = []; // Estadísticas combinadas del partido

  constructor(
    private readonly footballService: FootballService,
    private readonly route: ActivatedRoute,
    private readonly location: Location
  ) {}

  ngOnInit(): void {
    const matchId = this.route.snapshot.paramMap.get('id'); // Obtener el ID del partido desde la URL
    if (matchId) {
      const numericMatchId = parseInt(matchId, 10);
      if (!isNaN(numericMatchId)) {
        this.handleMatchLoading(numericMatchId);
      } else {
        this.setError('Invalid match ID.');
      }
    } else {
      this.setError('Invalid match ID.');
    }
  }

  goBack(): void {
    this.location.back(); // Navegar hacia atrás
  }

  private handleMatchLoading(matchId: number): void {
    this.isLoading = true;
    this.loadMatchDetails(matchId);
    this.loadLineups(matchId);
  }

  private loadMatchDetails(matchId: number): void {
    this.footballService.getMatchDetails(matchId).subscribe({
      next: (response) => {
        this.matchDetails = response?.data || null;
        if (this.matchDetails) {
          this.processStatistics();
        } else {
          this.setError('Match details not found.');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading match details:', error);
        this.setError('Failed to load match details.');
      },
    });
  }

  private loadLineups(matchId: number): void {
    this.footballService.getLineups(matchId).subscribe({
      next: (response) => {
        this.lineups = response?.data?.lineups || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading lineups:', error);
        this.setError('Failed to load lineups.');
      },
    });
  }

  private processStatistics(): void {
    const homeStats = this.matchDetails?.statistics?.find(
      (stat: any) => stat.team === this.matchDetails.teams.home.name
    )?.stats;
    const awayStats = this.matchDetails?.statistics?.find(
      (stat: any) => stat.team === this.matchDetails.teams.away.name
    )?.stats;

    if (homeStats && awayStats) {
      this.combinedStatistics = homeStats.map((homeStat: any, index: number) => ({
        name: homeStat.type,
        homeValue: homeStat.value ?? 0,
        awayValue: awayStats[index]?.value ?? 0,
      }));
    }
  }

  getMatchStatus(): string {
    const status = this.matchDetails?.fixture?.status?.short || '';
    if (status === 'NS') {
      return 'Not Started';
    } else if (['1H', '2H', 'ET', 'P'].includes(status)) {
      return 'In Progress';
    } else if (['FT', 'AET', 'PEN'].includes(status)) {
      return 'Finished';
    } else {
      return 'Unknown Status';
    }
  }

  getEventIcon(eventType: string, eventDetail: string): string {
    let iconPath = 'assets/icons/event-icon.png';

    if (eventType.toLowerCase() === 'goal') {
      iconPath = 'assets/icons/goal-icon.png';
    } else if (eventType.toLowerCase() === 'card') {
      if (eventDetail.toLowerCase().includes('yellow')) {
        iconPath = 'assets/icons/card-icon.png';
      } else if (eventDetail.toLowerCase().includes('red')) {
        iconPath = 'assets/icons/card-icon2.png';
      }
    } else if (eventType.toLowerCase() === 'subst') {
      iconPath = 'assets/icons/substitution-icon.png';
    }

    return iconPath;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  private setError(message: string): void {
    this.errorMessage = message;
    this.isLoading = false;
  }
}
