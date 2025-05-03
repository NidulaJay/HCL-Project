import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/userService';
import { Router } from '@angular/router';
import { SessionService } from '../../services/sessionService';


@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  username: string = '';
  password: string = '';
  time: string = '';
  date: string = '';

  errorMsg = '';

  @ViewChild('usernameInput') usernameInput!: ElementRef;

  constructor(
    private fb: FormBuilder, 
    private userService: UserService,
    private router: Router,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {

    if(this.sessionService.getCurrentUser()){
      this.router.navigate(['/']);
    }

    this.errorMsg = '';

    this.loginForm = this.fb.group({
      Username: ['', Validators.required],
      Password: ['', Validators.required]
    });
    
    this.updateTime();

    setTimeout(() => {
      this.usernameInput.nativeElement.focus();
    })

    setInterval(() => this.updateTime(), 1000);
  }

  onSubmit(): void {
    if(this.loginForm.valid){
      this.errorMsg = '';
      const username = this.loginForm.get('Username')?.value;
      const password = this.loginForm.get('Password')?.value;

      this.userService.login(username, password).subscribe({
        next: (response) => {
          console.log('Login Successfull', response);
          this.errorMsg = '';
          this.sessionService.saveToSession(response)
          this.router.navigate(["/"]);
        },
        error: (err) => {
            this.errorMsg = 'Invalid Credentials';
        }})
    }
    else{
      const usernameControl = this.loginForm.get('Username');
      const passwordControl = this.loginForm.get('Password');

      if (usernameControl?.hasError('required') || passwordControl?.hasError('required')) {
        this.errorMsg = 'Some fields are empty';
      } else {
        this.errorMsg = 'Invalid form'; 
      }
    }
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
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }
}
