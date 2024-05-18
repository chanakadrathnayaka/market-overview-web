import {Component, inject} from '@angular/core';
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {SymbolService} from "../../services/symbol.service";
import {SearchResult} from "../../models/SearchResult";
import {MatListModule, MatSelectionListChange} from "@angular/material/list";
import {FormsModule} from "@angular/forms";
import {MatExpansionModule} from "@angular/material/expansion";
import {ApplicationService} from "../../services/application.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatExpansionModule,
    FormsModule
  ],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.css'
})
export class SearchBoxComponent {
  isLoading: boolean = false;
  searchResults: SearchResult[] = [];
  resultCount: number = -1;
  error: string | null = null;
  searchValue: string = '';

  symbolService: SymbolService = inject(SymbolService);
  applicationService: ApplicationService = inject(ApplicationService);
  userService: UserService = inject(UserService);

  constructor(public dialogRef: MatDialogRef<SearchBoxComponent>) {
  }

  search(e: any) {
    e.preventDefault();

    if (!this.searchValue) {
      this.error = "Search Value is required"
      return;
    }
    this.isLoading = true;
    this.error = null;
    this.symbolService.search(this.searchValue).subscribe({
      next: value => {
        this.searchResults = value.result;
        this.resultCount = value.count;
        this.isLoading = false;
      },
      error: error => {
        this.isLoading = false;
        this.error = error.error.message || error.message;
      }
    })
  }

  selectSymbol(event: MatSelectionListChange) {
    const selectedOptions = event.source.selectedOptions.selected;
    const selectedValues = selectedOptions.map(option => (<string>option.value));

    const updatedSymbols = this.applicationService.addSymbol(selectedValues);
    const userProfile = this.applicationService.getUserProfile().getValue();
    const currentEmail = userProfile.email;
    this.userService.update(currentEmail, {preferences: Array.from(updatedSymbols)}).subscribe({
      next: value => {
        this.applicationService.setLoggedIn(true);
        this.applicationService.setUserProfile(value);
      }
    });
  }
}
