import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FootballService {
  private readonly apiUrl = 'http://localhost:3000/api';

  constructor(private readonly http: HttpClient) {}

  // Obtener todas las ligas
  getLeagues(): Observable<any> {
    return this.http.get(`${this.apiUrl}/leagues`);
  }

  // Obtener detalles de una liga específica
  getLeagueDetails(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/league/details/${id}`);
  }

  // Obtener próximos partidos de una liga
  getUpcomingFixtures(leagueId: string, season: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/league/fixtures/upcoming/${leagueId}?season=${season}`
    );
  }

  // Obtener resultados recientes de una liga
  getRecentResults(leagueId: string, season: string) {
    return this.http.get<any>(
      `http://localhost:3000/api/league/fixtures/recent/${leagueId}?season=${season}`
    );
  }
  
  // Obtener tabla de posiciones de una liga para una temporada específica
  getStandings(id: string, season: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/league/standings/${id}?season=${season}`
    );
  }

  getMatchesToday() {
    return this.http.get<{ status: string; data: { allMatches: any[]; liveMatches: any[] } }>(
      'http://localhost:3000/api/matches/today'
    );
  }

  getTeamMatches2(teamId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/team/${teamId}/matches`);
  }
  
  getStandings2(leagueId: string, season: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tablas/${leagueId}/${season}`);
  }

  getPlayerStats(leagueId: number, season: string, teamId: number) {
    return this.http.get<any>(
      `http://localhost:3000/api/players/stats?leagueId=${leagueId}&season=${season}&teamId=${teamId}`
    );
  }
  

  getPlayerInfo(playerId: string, season: string): Observable<any> {
    const url = `${this.apiUrl}/info/?playerId=${playerId}&season=${season}`;
    return this.http.get<any>(url);
  }
  
  // Obtener partidos en vivo de una liga específica
  getLiveFixtures(leagueId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/league/fixtures/live/${leagueId}`);
  }

  getMatchDetails(matchId: number) {
    return this.http.get<{ status: string; data: any }>(`http://localhost:3000/api/match/details/${matchId}`);
  }
  getLineups(matchId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/lineups/${matchId}`);
  }
  
  getRefereesOverview(leagueId: number, season: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/referees/overview/${leagueId}?season=${season}`);
  }
  
  // Obtener equipos con soporte para búsqueda
  getTeams(leagueId: number, season: number, search: string = ''): Observable<any> {
    const params: any = { leagueId, season };
    if (search) {
      params.search = search;
    }
    return this.http.get(`${this.apiUrl}/teams`, { params });
  }
  
  searchTeams(searchQuery: string): Observable<any> {
    const params: any = { search: searchQuery };
    return this.http.get(`${this.apiUrl}/teams`, { params });
  }
  
  getTeamOverview(teamId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/team-details/${teamId}/overview`);
  }

  getTeamDetails(teamId: number) {
    return this.http.get<any>(`http://localhost:3000/api/teams/${teamId}/details`);
  }
  
  getTeamMatches(teamId: number, season: string) {
    return this.http.get<any>(`http://localhost:3000/api/teams/${teamId}/matches?season=${season}`);
  }  
  // Obtener todas las categorías de partidos (en vivo, recientes, próximos)
  getAllMatches(): Observable<any> {
    return forkJoin({
      live: this.http.get(`${this.apiUrl}/matches/live`),
      recent: this.http.get(`${this.apiUrl}/matches/recent`),
      upcoming: this.http.get(`${this.apiUrl}/matches/upcoming`)
    });
  }
}
