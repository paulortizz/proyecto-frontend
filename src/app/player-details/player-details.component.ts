import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FootballService } from '../football.service'; // Asegúrate de que este servicio esté implementado
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-player-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-details.component.html',
  styleUrls: ['./player-details.component.css'],
})
export class PlayerDetailsComponent implements OnInit {
  playerInfo: any = null; // Datos del jugador
  isLoading: boolean = true; // Indicador de carga
  errorMessage: string = ''; // Mensaje de error

  constructor(
    private readonly route: ActivatedRoute,
    private readonly footballService: FootballService
  ) {}

  ngOnInit(): void {
    // Obtener parámetros de la URL (playerId y season)
    this.route.queryParams.subscribe((params) => {
      const playerId = params['playerId'];
      const season = params['season'];
      if (playerId && season) {
        this.loadPlayerInfo(playerId, season);
      } else {
        this.isLoading = false;
        this.errorMessage = 'Invalid player ID or season.';
      }
    });
  }

  loadPlayerInfo(playerId: string, season: string): void {
    this.footballService.getPlayerInfo(playerId, season).subscribe({
      next: (response) => {
        if (response?.status === 'success' && response?.data) {
          this.playerInfo = response.data;
        } else {
          this.errorMessage = 'Player data not found.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching player info:', error);
        this.errorMessage = 'Failed to load player data.';
        this.isLoading = false;
      },
    });
  }

  // Método para mostrar un mensaje alternativo si la información es 'N/A'
  displayValue(value: string): string {
    return value !== 'N/A' ? value : 'Not available';
  }
}
