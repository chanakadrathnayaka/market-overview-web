import {Component, inject, OnInit} from '@angular/core';
import {MatStepperModule} from "@angular/material/stepper";
import {SearchComponent} from "../search/search.component";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {ApplicationService} from "../../services/application.service";

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [MatStepperModule, SearchComponent, MatButtonModule, MatDialogModule],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.css'
})
export class SetupComponent implements OnInit {
  name: string = '';
  applicationService: ApplicationService = inject(ApplicationService);
  hasSymbolsSelected: boolean = false;

  constructor(public dialogRef: MatDialogRef<SetupComponent>) {
  }

  ngOnInit(): void {
    this.name = this.applicationService.getUserProfile().getValue().firstName;
    this.applicationService.symbols().subscribe({
      next: (data: Set<string>) => {
        this.hasSymbolsSelected = data.size > 0;
      }
    })
  }

  check() {
    return true;
  }

  close() {
    this.dialogRef.close();
  }
}
