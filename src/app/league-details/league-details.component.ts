import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FootballService } from '../football.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-league-details',
  standalone: true,
  templateUrl: './league-details.component.html',
  styleUrls: ['./league-details.component.css'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class LeagueDetailsComponent implements OnInit {
  league: any = {};
  country: any = {};
  fixtures: any[] = [];
  groupedFixtures: { matchday: number; fixtures: any[] }[] = [];
  results: any[] = [];
  standings: any[] = [];
  liveFixtures: any[] = [];
  groups: { [key: string]: any[] } = {};
  currentSection: string = 'overview';
  currentSeason: string = new Date().getFullYear().toString();
  selectedSeason: string = this.currentSeason;
  availableSeasons: string[] = Array.from(
    { length: 5 },
    (_, i) => (parseInt(this.currentSeason) - i).toString()
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly footballService: FootballService,
    private readonly location: Location
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const leagueId = params.get('id');
      if (leagueId) {
        this.loadLeagueDetails(leagueId);
        this.loadFixtures(leagueId, this.selectedSeason);
        this.loadResults(leagueId);
        this.loadStandings(leagueId, this.selectedSeason);
        this.loadLiveFixtures(leagueId);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  loadLeagueDetails(leagueId: string) {
    this.footballService.getLeagueDetails(leagueId).subscribe({
      next: (data: any) => {
        if (data && data.status === 'success') {
          this.league = data.data.league || {};
          this.country = data.data.country || {};
        }
      },
      error: (err) => console.error('Error al obtener detalles de la liga:', err),
    });
  }

  loadFixtures(leagueId: string, season: string) {
    this.footballService.getUpcomingFixtures(leagueId, season).subscribe({
      next: (data: any) => {
        if (data && data.status === 'success' && data.data.length > 0) {
          const now = new Date();
          this.fixtures = data.data.filter((fixture: any) => new Date(fixture.date) >= now);
          this.groupFixturesByMatchday();
        } else {
          this.fixtures = [];
          this.groupedFixtures = [];
        }
      },
      error: (err) => {
        console.error('Error al obtener los partidos:', err);
        this.fixtures = [];
        this.groupedFixtures = [];
      },
    });
  }

  groupFixturesByMatchday() {
    const grouped = this.fixtures.reduce((acc, fixture) => {
      const matchday = fixture.matchday || 1;
      if (!acc[matchday]) {
        acc[matchday] = [];
      }
      acc[matchday].push(fixture);
      return acc;
    }, {});

    this.groupedFixtures = Object.keys(grouped)
      .map((key) => ({
        matchday: parseInt(key, 10),
        fixtures: grouped[key],
      }))
      .sort((a, b) => a.matchday - b.matchday);
  }

  loadResults(leagueId: string) {
    this.footballService.getRecentResults(leagueId, this.selectedSeason).subscribe({
      next: (data: any) => {
        if (data && data.status === 'success') {
          this.results = data.data.map((result: any) => ({
            id: result.id, // Mapea correctamente el ID del partido
            date: result.date,
            teams: {
              home: {
                name: result.teams.home.name,
                logo: result.teams.home.logo,
              },
              away: {
                name: result.teams.away.name,
                logo: result.teams.away.logo,
              },
            },
            goals: {
              home: result.goals.home,
              away: result.goals.away,
            },
            status: result.status || 'FT',
          }));
        } else {
          this.results = [];
        }
      },
      error: (err) => {
        console.error('Error al obtener resultados recientes:', err);
        this.results = [];
      },
    });
  }

  loadStandings(leagueId: string, season: string): void {
    this.footballService.getStandings(leagueId, season).subscribe({
      next: (data: any) => {
        const standingsData = data.data || [];
        if (standingsData.length && standingsData[0]?.group) {
          this.groups = {};
          standingsData.forEach((team: any) => {
            const group = team.group || 'General';
            if (!this.groups[group]) {
              this.groups[group] = [];
            }
            this.groups[group].push(team);
          });
        } else {
          this.groups = {};
          this.standings = standingsData;
        }
      },
      error: (err) =>
        console.error('Error al obtener la tabla de posiciones:', err),
    });
  }

  loadLiveFixtures(leagueId: string): void {
    this.footballService.getLiveFixtures(leagueId).subscribe({
      next: (data: any) => {
        this.liveFixtures = data?.data || [];
      },
      error: (err) => {
        console.error('Error al obtener partidos en vivo:', err);
        this.liveFixtures = [];
      },
    });
  }

  onSeasonChange(season: string) {
    this.selectedSeason = season;
    const leagueId = this.route.snapshot.paramMap.get('id');
    if (leagueId) {
      this.loadFixtures(leagueId, season);
      this.loadStandings(leagueId, season);
      this.loadResults(leagueId);
    }
  }

  showSection(section: string) {
    this.currentSection = section;
  }

  getGroupKeys(): string[] {
    return this.groups ? Object.keys(this.groups) : [];
  }
}
