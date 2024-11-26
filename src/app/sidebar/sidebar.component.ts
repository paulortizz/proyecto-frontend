import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FootballService } from '../football.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [CommonModule, RouterModule],
})
export class SidebarComponent implements OnInit {
  @Output() navigate = new EventEmitter<void>();

  leagues: any[] = []; // Lista de ligas
  refereeGroups: { [key: string]: any[] } = {}; // Árbitros agrupados por país u organización
  displayedLeagues: any[] = []; // Ligas visibles
  displayedRefereeGroups: { [key: string]: any[] } = {}; // Árbitros visibles agrupados

  showAllLeagues = false; // Control de expansión de ligas
  showAllReferees = false; // Control de expansión de árbitros

  featuredLeagueIds = [39, 140, 2, 78, 307, 262]; // IDs de ligas destacadas
  currentLeagueId: number | null = null; // Liga seleccionada actualmente

  constructor(
    private readonly footballService: FootballService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadLeagues(); // Cargar ligas al inicializar
  }

  // Métodos para manejar ligas
  toggleShowAll(): void {
    this.showAllLeagues = !this.showAllLeagues;
    this.displayedLeagues = this.showAllLeagues
      ? this.leagues
      : this.featuredLeagues;
  }

  viewMatches(leagueId: number): void {
    this.currentLeagueId = leagueId; // Actualizar liga seleccionada
    const currentYear = new Date().getFullYear().toString();
    this.loadDefaultReferees(leagueId, currentYear); // Cargar árbitros de la liga seleccionada
  }

  get featuredLeagues(): any[] {
    return this.leagues.filter((league) =>
      this.featuredLeagueIds.includes(league.id)
    );
  }

  loadLeagues(): void {
    this.footballService.getLeagues().subscribe({
      next: (data: any) => {
        if (data && data.status === 'success') {
          this.leagues = data.data || [];
          this.displayedLeagues = this.featuredLeagues;

          // Establecer la liga actual si aún no hay una seleccionada
          if (this.leagues.length > 0 && this.currentLeagueId === null) {
            this.currentLeagueId = this.leagues[0].id; // Primera liga como selección inicial
            const currentYear = new Date().getFullYear().toString();
            this.loadDefaultReferees(this.currentLeagueId, currentYear);
          }
        }
      },
      error: (error: any) => console.error('Error al obtener ligas:', error),
    });
  }

  // Métodos para manejar árbitros
  toggleShowAllReferees(): void {
    if (Object.keys(this.refereeGroups).length === 0) {
      console.warn('No hay árbitros para mostrar.');
      return;
    }
    this.showAllReferees = !this.showAllReferees;
    this.displayedRefereeGroups = this.showAllReferees
      ? this.refereeGroups
      : this.limitRefereeGroups();
  }

  limitRefereeGroups(): { [key: string]: any[] } {
    const limitedGroups: { [key: string]: any[] } = {};
    for (const [country, referees] of Object.entries(this.refereeGroups)) {
      limitedGroups[country] = referees.slice(0, 5); // Mostrar 5 árbitros por país
    }
    return limitedGroups;
  }

  loadDefaultReferees(leagueId: number | null, season: string): void {
    if (leagueId === null) {
      console.warn('No league selected, skipping referee load.');
      return;
    }
    this.footballService.getRefereesOverview(leagueId, season).subscribe({
      next: (data: any) => {
        if (data && data.status === 'success') {
          this.refereeGroups = data.data || {}; // Agrupado por país u organización
          this.displayedRefereeGroups = this.limitRefereeGroups(); // Mostrar árbitros limitados inicialmente
        } else {
          console.warn('No hay datos de árbitros disponibles.');
          this.refereeGroups = {};
          this.displayedRefereeGroups = {};
        }
      },
      error: (error: any) =>
        console.error('Error al obtener árbitros para la liga:', error),
    });
  }

  viewRefereeDetails(refereeName: string): void {
    if (this.currentLeagueId) {
      this.router.navigate([`/referee/${this.currentLeagueId}/${refereeName}`]);
    } else {
      console.warn('No league selected to fetch referees.');
    }
  }
}
