import {Component, inject, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {MatTabsModule} from "@angular/material/tabs";
import {
  FormControl,
  FormGroupDirective,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ErrorStateMatcher} from "@angular/material/core";
import {MatButtonModule} from "@angular/material/button";
import {ApplicationService} from "../../services/application.service";
import {UserProfile} from "../../models/UserProfile";
import {MatDividerModule} from "@angular/material/divider";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MatTabsModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, MatDividerModule, MatListModule, MatIconModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  userService: UserService = inject(UserService);
  applicationService: ApplicationService = inject(ApplicationService);
  currentProfile: UserProfile = {} as UserProfile;

  emailFormControl = new FormControl('', [Validators.email]);
  passwordFormControl = new FormControl('', []);
  firstNameFormControl = new FormControl('', []);
  lastNameFormControl = new FormControl('', []);
  matcher = new MyErrorStateMatcher();
  error?: string;
  symbols: string[] = [];

  ngOnInit(): void {
    this.applicationService.getUserProfile().subscribe({
      next: (result: UserProfile) => {
        this.currentProfile = result;
        this.emailFormControl.setValue(result.email);
        this.firstNameFormControl.setValue(result.firstName);
        this.lastNameFormControl.setValue(result.lastName);
        this.symbols = result.preferences || [];
      }
    })
  }

  update(e: any): void {
    e.preventDefault();
    const profile: UserProfile = {} as UserProfile;
    let password;
    if (this.firstNameFormControl.value && this.currentProfile.firstName !== this.firstNameFormControl.value && this.firstNameFormControl.valid) {
      profile.firstName = this.firstNameFormControl.value!;
    }
    if (this.lastNameFormControl.value && this.currentProfile.lastName !== this.lastNameFormControl.value && this.lastNameFormControl.valid) {
      profile.lastName = this.lastNameFormControl.value!;
    }
    if (this.emailFormControl.value && this.currentProfile.email !== this.emailFormControl.value && this.emailFormControl.valid) {
      profile.email = this.emailFormControl.value!;
    }
    if (this.passwordFormControl.value && this.passwordFormControl.valid) {
      password = this.passwordFormControl.value!;
    }

    if (this.currentProfile.preferences?.length !== this.symbols.length) {
      profile.preferences = this.symbols;
    } else {
      const preferences = new Set<string>(this.currentProfile.preferences);
      if (this.symbols.every((s: string) => preferences.has(s))) {
        profile.preferences = this.symbols;
      }
    }

    this.userService.update(this.currentProfile.email, {...profile, password}).subscribe({
      next: value => {
        this.applicationService.setUserProfile(value);
      }
    });
  }

  delete(symbol: string) {
    this.symbols = Array.from(this.applicationService.removeSymbol(symbol));
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
