import { Routes } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LeagueDetailsComponent } from './league-details/league-details.component';
import { MatchDetailsComponent } from './match-details/match-details.component';
import { RefereeDetailsComponent } from './referee-details/referee-details.component';
import { TeamDetailsComponent } from './team-details/team-details.component';

export const routes: Routes = [
  { path: '', component: SidebarComponent },
  { path: 'league/:id', component: LeagueDetailsComponent },
  { path: 'team/:id', component: TeamDetailsComponent },
  { path: 'referee/:leagueId/:name', component: RefereeDetailsComponent },

  {
    path: 'match/:id',
    component: MatchDetailsComponent
  },
  


];
