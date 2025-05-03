import { Component, OnInit } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { StringKeyframeTrack } from 'three';
import { SessionService } from '../services/sessionService';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, MatSnackBarModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private session: SessionService) {}
  showNavbar = true;

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkRoute(this.router.url);
        this.checkLoggedIn(this.router.url);
      });
  }

  checkLoggedIn(url: string): void {
    if (!(url.endsWith('/login') || url.endsWith('/signup'))) {
      if (!this.session.getCurrentUser()) {
        this.router.navigate(['/login']);
      }
    } else {
      if (this.session.getCurrentUser()) {
        this.router.navigate(['/']);
      }
    }
  }

  checkRoute(url: string): void {
    if (url.endsWith('/login') || url.endsWith('/signup')) {
      this.showNavbar = false;
    } else {
      this.showNavbar = true;
    }
  }
}
