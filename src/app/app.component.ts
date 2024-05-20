import {Component, inject, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatListModule} from "@angular/material/list";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {SearchDialogComponent} from "./components/search-dialog/search-dialog.component";
import {ApplicationService} from "./services/application.service";
import {AccessComponent} from "./components/access/access.component";
import {SetupComponent} from "./components/setup/setup.component";
import {ExchangeService} from "./services/exchange.service";
import {ExchangeResponse} from "./models/ExchangeResponse";
import {MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule, MatListModule, MatToolbarModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatTooltipModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  applicationService: ApplicationService = inject(ApplicationService);
  exchangeService: ExchangeService = inject(ExchangeService);
  router: Router = inject(Router);

  hideMenuText: boolean = true;
  isUserLoggedIn: boolean = false;
  marketStatus: ExchangeResponse = {exchange: "US", isOpen: false, session: null, holiday: null};
  currentRoute: string | null = null;

  constructor(public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.applicationService.isLoggedIn().subscribe(isUserLoggedIn => {
      this.isUserLoggedIn = isUserLoggedIn;
      if (!isUserLoggedIn) {
        this.dialog.open(AccessComponent, {
          width: '30%',
          disableClose: true
        });
      } else if (isUserLoggedIn && !this.hasSymbolsSetup()) {
        this.dialog.open(SetupComponent, {
          width: '50%',
          disableClose: true
        })
      }
    });

    this.exchangeService.status('US').subscribe({
      next: (response: ExchangeResponse) => {
        this.marketStatus = response;
      }
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });
  }

  logout() {
    this.applicationService.setLoggedIn(false);
  }

  toggleDisplayText() {
    this.hideMenuText = !this.hideMenuText;
  }

  openSearchBox(): void {
    this.dialog.open(SearchDialogComponent, {
      width: '70%',
      height: 'fit-content',
    });
  }

  hasSymbolsSetup() {
    const preferences = this.applicationService.getUserProfile().getValue().preferences;
    return preferences && preferences?.length !== 0
  }
}
