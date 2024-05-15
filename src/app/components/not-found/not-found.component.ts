import {Component} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatRadioModule} from "@angular/material/radio";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    MatSidenavModule, MatButtonModule, MatRadioModule, FormsModule, ReactiveFormsModule, MatDividerModule, MatProgressBarModule,
    MatProgressSpinnerModule, MatSlideToggleModule
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {

}
