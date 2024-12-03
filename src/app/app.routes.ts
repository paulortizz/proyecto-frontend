import { Routes } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LeagueDetailsComponent } from './league-details/league-details.component';
import { MatchDetailsComponent } from './match-details/match-details.component';
import { RefereeDetailsComponent } from './referee-details/referee-details.component';
import { TeamDetailsComponent } from './team-details/team-details.component';
import { TeamMatchesComponent } from './team-matches/team-matches.component';
import { TeamOverviewComponent } from './team-overview/team-overview.component';
 
export const routes: Routes = [
  { path: '', component: SidebarComponent },
  { path: 'league/:id', component: LeagueDetailsComponent },
  {
    path: 'team/:id',
    component: TeamDetailsComponent,
    children: [
      { path: 'overview', component: TeamOverviewComponent },
      { path: 'matches', component: TeamMatchesComponent },
    ],
  },
  { path: 'referee/:leagueId/:name', component: RefereeDetailsComponent },
  { path: 'match/:id', component: MatchDetailsComponent },
];
