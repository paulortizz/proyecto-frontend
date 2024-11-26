import { Routes } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LeagueDetailsComponent } from './league-details/league-details.component';
import { MatchDetailsComponent } from './match-details/match-details.component';
import { RefereeDetailsComponent } from './referee-details/referee-details.component';


export const routes: Routes = [
  { path: '', component: SidebarComponent },
  { path: 'league/:id', component: LeagueDetailsComponent },
  { path: 'referee/:leagueId/:name', component: RefereeDetailsComponent },
  {
    path: 'match/:id',
    component: MatchDetailsComponent
  },
  


];
