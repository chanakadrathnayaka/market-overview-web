import {Component, inject} from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatTabsModule} from "@angular/material/tabs";
import {UserService} from "../../services/user.service";
import {ErrorStateMatcher} from "@angular/material/core";
import {MatDialogRef} from "@angular/material/dialog";
import {ApplicationService} from "../../services/application.service";
import {MatProgressBarModule} from "@angular/material/progress-bar";

@Component({
  selector: 'app-access',
  standalone: true,
  imports: [MatTabsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, FormsModule, MatProgressBarModule],
  templateUrl: './access.component.html',
  styleUrl: './access.component.css'
})
export class AccessComponent {

  userService: UserService = inject(UserService);
  applicationService: ApplicationService = inject(ApplicationService);

  loginEmailFormControl = new FormControl('', [Validators.required, Validators.email]);
  loginPasswordFormControl = new FormControl('', [Validators.required]);
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required]);
  firstNameFormControl = new FormControl('', [Validators.required]);
  lastNameFormControl = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();
  error?: string;
  isLoading: boolean = false;

  constructor(public dialogRef: MatDialogRef<AccessComponent>) {
  }

  login(e: any) {
    e.preventDefault();
    if (this.loginEmailFormControl.valid && this.loginPasswordFormControl.valid) {
      this.isLoading = true;
      this.userService.login(this.loginEmailFormControl.value!, this.loginPasswordFormControl.value!).subscribe({
        next: value => {
          this.isLoading = false;
          this.applicationService.setLoggedIn(true);
          this.applicationService.setUserProfile(value);
          this.close();
        },
        error: (error) => {
          this.error = error.error.message || error.message;
          this.isLoading = false;
        }
      })
    }
  }

  register(e: any) {
    e.preventDefault();
    if (this.emailFormControl.valid && this.passwordFormControl.valid && this.firstNameFormControl.valid && this.lastNameFormControl.valid) {
      this.isLoading = true;
      this.userService.register(this.emailFormControl.value!, this.passwordFormControl.value!, this.firstNameFormControl.value!, this.lastNameFormControl.value!).subscribe({
        next: value => {
          this.isLoading = false;
          this.applicationService.setLoggedIn(true);
          this.applicationService.setUserProfile(value);
          this.close();
        },
        error: error => {
          this.error = error.error.message || error.message;
          this.isLoading = false;
        }
      })
    }
  }

  actionChanged() {
    this.error = '';
  }

  close() {
    this.dialogRef.close();
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
