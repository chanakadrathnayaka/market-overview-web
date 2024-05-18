import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatListModule} from "@angular/material/list";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {SearchBoxComponent} from "./components/search-box/search-box.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule, MatListModule, MatToolbarModule, MatIconModule, RouterLink, RouterLinkActive, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'market-overview-web';
  hideMenuText: boolean = true;

  constructor(public dialog: MatDialog) {
  }

  logout() {
    alert('working')
  }

  toggleDisplayText() {
    this.hideMenuText = !this.hideMenuText;
  }

  openSearchBox(): void {
    const dialogRef = this.dialog.open(SearchBoxComponent, {
      width: '70%',
      height: '50%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
