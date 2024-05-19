import {Component, inject, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule, MatListModule, MatToolbarModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  applicationService: ApplicationService = inject(ApplicationService);

  hideMenuText: boolean = true;
  isUserLoggedIn: boolean = false;

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
