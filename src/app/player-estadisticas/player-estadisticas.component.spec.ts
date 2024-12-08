import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerEstadisticasComponent } from './player-estadisticas.component';

describe('PlayerEstadisticasComponent', () => {
  let component: PlayerEstadisticasComponent;
  let fixture: ComponentFixture<PlayerEstadisticasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerEstadisticasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerEstadisticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
