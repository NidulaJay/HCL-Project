import { Component, Input } from '@angular/core';
import { Preset } from '../../../models/preset.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-design-card',
  imports: [],
  templateUrl: './design-card.component.html',
  styleUrl: './design-card.component.css'
})
export class DesignCardComponent {
  @Input() preset!: Preset; 
  
  constructor(private router: Router){}
  navigateToDesign(): void {
    this.router.navigate(['/design', this.preset.id]);
  }

}
