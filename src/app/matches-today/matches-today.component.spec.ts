import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchesTodayComponent } from './matches-today.component';

describe('MatchesTodayComponent', () => {
  let component: MatchesTodayComponent;
  let fixture: ComponentFixture<MatchesTodayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchesTodayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchesTodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
