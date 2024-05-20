import {Routes} from '@angular/router';
import {OverviewComponent} from "./components/overview/overview.component";
import {RealtimeComponent} from "./components/realtime/realtime.component";
import {UserComponent} from "./components/user/user.component";

// Not found will be fall back to home page, Handled by the web server
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
  }
];
