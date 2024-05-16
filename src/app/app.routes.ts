import {Routes} from '@angular/router';
import {NotFoundComponent} from "./components/not-found/not-found.component";
import {OverviewComponent} from "./components/overview/overview.component";
import {RealtimeComponent} from "./components/realtime/realtime.component";
import {UserComponent} from "./components/user/user.component";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full'
  },
  {
    path: 'overview',
    component: OverviewComponent,
  },
  {
    path: 'realtime',
    component: RealtimeComponent,
  },
  {
    path: 'profile',
    component: UserComponent,
  },
  {
    path: '**',
    pathMatch: 'full',
    component: NotFoundComponent
  }
];
