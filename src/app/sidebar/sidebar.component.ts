import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FootballService } from '../football.service';
import { FormsModule } from '@angular/forms'; // Importar FormsModule

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [CommonModule, RouterModule, FormsModule],
})
export class SidebarComponent implements OnInit {
  @Output() navigate = new EventEmitter<void>();

  leagues: any[] = []; // Lista de ligas
  refereeGroups: { [key: string]: any[] } = {}; // Árbitros agrupados por país u organización
  displayedLeagues: any[] = []; // Ligas visibles
  displayedRefereeGroups: { [key: string]: any[] } = {}; // Árbitros visibles agrupados
  teams: any[] = []; // Lista de equipos visibles en la UI
  showAllTeams = false; // Control para expandir y contraer la lista de equipos
  searchQuery: string = ''; // Término de búsqueda para equipos
  defaultTeams: any[] = [
    { id: 1, name: 'Real Madrid', logo: 'https://path-to-logo/realmadrid.png', country: 'Spain' },
    { id: 2, name: 'Manchester United', logo: 'https://path-to-logo/manutd.png', country: 'England' },
    { id: 3, name: 'Barcelona', logo: 'https://path-to-logo/barcelona.png', country: 'Spain' },
    { id: 4, name: 'Al Nassr', logo: 'https://path-to-logo/alnassr.png', country: 'Saudi Arabia' },
    { id: 5, name: 'Bayern Munich', logo: 'https://path-to-logo/bayernmunich.png', country: 'Germany' },
  ]; // Equipos predeterminados visibles inicialmente

  showAllLeagues = false; // Control de expansión de ligas
  showAllReferees = false; // Control de expansión de árbitros

  featuredLeagueIds = [39, 140, 2, 78, 307, 262]; // IDs de ligas destacadas
  currentLeagueId: number | null = null; // Liga seleccionada actualmente

  constructor(
    private readonly footballService: FootballService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadDefaultTeams(); // Cargar equipos predeterminados al inicio
    this.loadLeagues(); // Cargar ligas al inicializar
  }

  // Métodos para manejar ligas
  toggleShowAll(): void {
    this.showAllLeagues = !this.showAllLeagues;
    this.displayedLeagues = this.showAllLeagues
      ? this.leagues
      : this.featuredLeagues;
  }

  viewMatches(leagueId: number | string): void {
    this.router.navigate(['/league', leagueId]);
    this.currentLeagueId = typeof leagueId === 'string' ? parseInt(leagueId, 10) : leagueId; // Actualizar liga seleccionada
    const currentYear = new Date().getFullYear().toString();
    this.loadDefaultReferees(this.currentLeagueId, currentYear); // Cargar árbitros de la liga seleccionada
    this.loadTeams(this.currentLeagueId, currentYear); // Cargar equipos de la liga seleccionada
  }

  viewTeamDetails(teamId: number): void {
    this.router.navigate(['/team', teamId]);
  }
  getObjectKeys(obj: { [key: string]: any[] }): string[] {
    return Object.keys(obj);
  }
  
  

  get featuredLeagues(): any[] {
    return this.leagues.filter((league) =>
      this.featuredLeagueIds.includes(league.id)
    );
  }

  loadLeagues(): void {
    this.footballService.getLeagues().subscribe({
      next: (data: any) => {
        if (data && Array.isArray(data.data)) {
          this.leagues = data.data;
          this.displayedLeagues = this.featuredLeagues;

          // Establecer la liga actual si aún no hay una seleccionada
          if (this.leagues.length > 0 && this.currentLeagueId === null) {
            this.currentLeagueId = this.leagues[0].id; // Primera liga como selección inicial
            const currentYear = new Date().getFullYear().toString();
            this.loadDefaultReferees(this.currentLeagueId, currentYear);
            this.loadTeams(this.currentLeagueId, currentYear);
          }
        } else {
          console.warn('La respuesta de la API no contiene datos válidos.');
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
    const REFEREE_LIMIT = 5; // Número máximo de árbitros a mostrar por grupo
    const limitedGroups: { [key: string]: any[] } = {};
    for (const [country, referees] of Object.entries(this.refereeGroups)) {
      limitedGroups[country] = referees.slice(0, REFEREE_LIMIT);
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
          // La respuesta es una lista de árbitros
          this.refereeGroups = { Referees: data.data }; // Colocar los árbitros bajo una clave "Referees"
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
  
  
   
  // Método para cargar equipos por liga y temporada
loadTeams(leagueId: number | null, season: string): void {
  if (!leagueId) {
    this.loadDefaultTeams(); // Cargar equipos predeterminados si no hay liga seleccionada
    return;
  }

  this.footballService.getTeams(leagueId, parseInt(season, 10), this.searchQuery).subscribe({
    next: (data: any) => {
      if (data && data.status === 'success') {
        this.teams = data.data || [];
      } else {
        console.warn('No se encontraron equipos para esta liga y temporada.');
        this.loadDefaultTeams();
      }
    },
    error: (error: any) => {
      console.error('Error al cargar equipos:', error);
      this.loadDefaultTeams();
    },
  });
}


  // Cargar equipos por defecto
  loadDefaultTeams(): void {
    this.teams = [...this.defaultTeams];
  }

  onSearchChange(): void {
    if (!this.searchQuery.trim()) {
      // Si el campo de búsqueda está vacío, mostrar equipos predeterminados
      this.teams = [...this.defaultTeams];
      return;
    }
  
    // Buscar equipos globalmente (sin limitar a una liga)
    this.footballService.searchTeams(this.searchQuery).subscribe({
      next: (data: any) => {
        if (data && data.status === 'success') {
          this.teams = data.data || [];
        } else {
          this.teams = [];
        }
      },
      error: (error: any) => console.error('Error al buscar equipos:', error),
    });
  }
  
  

  toggleShowAllTeams(): void {
    this.showAllTeams = !this.showAllTeams;
  }

  viewRefereeDetails(refereeName: string): void {
    console.log(`Viewing details for referee: ${refereeName}`);
    if (this.currentLeagueId) {
      this.router.navigate([`/referee/${this.currentLeagueId}/${refereeName}`]);
    } else {
      console.warn('No league selected to fetch referees.');
    }
  }
}
