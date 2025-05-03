import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/userService';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  time: string = '';
  date: string = '';
  signupForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  ngOnInit(): void {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  private updateTime(): void {
    const now = new Date();

    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    this.time = `${hours}:${minutes}:${seconds}`;

    const day = now.getDate();
    const suffix = this.getOrdinalSuffix(day);
    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();
    this.date = `${month} ${day}${suffix} ${year}`;
  }

  private getOrdinalSuffix(day: number): string {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.signupForm.invalid) {
      if (this.signupForm.get('name')?.hasError('required')) {
        this.errorMessage = 'Name is required';
      } else if (this.signupForm.get('username')?.hasError('required')) {
        this.errorMessage = 'Username is required';
      } else if (this.signupForm.get('password')?.hasError('required')) {
        this.errorMessage = 'Password is required';
      } else if (this.signupForm.get('password')?.hasError('minlength')) {
        this.errorMessage = 'Password must be at least 4 characters long';
      }
      return;
    }

    this.isLoading = true;
    const { name, username, password } = this.signupForm.value;

    this.userService.register(name, username, password).subscribe({
      next: () => {
        this.isLoading = false;

        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 409) {
          this.errorMessage = 'This username already exists';
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      },
    });
  }
}
