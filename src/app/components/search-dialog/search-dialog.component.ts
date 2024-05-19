import {Component} from '@angular/core';
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {SearchComponent} from "../search/search.component";

@Component({
  selector: 'app-search-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    SearchComponent,
  ],
  templateUrl: './search-dialog.component.html',
  styleUrl: './search-dialog.component.css'
})
export class SearchDialogComponent {


  constructor(public dialogRef: MatDialogRef<SearchDialogComponent>) {
  }


}
