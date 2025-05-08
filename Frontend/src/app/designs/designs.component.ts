import { Component } from '@angular/core';
import { SessionService } from '../../services/sessionService';
import { PresetService } from '../../services/presetService';
import { Preset } from '../../models/preset.model';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { DesignCardComponent } from '../components/design-card/design-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-designs',
  imports: [DesignCardComponent, CommonModule],
  templateUrl: './designs.component.html',
  styleUrl: './designs.component.css'
})
export class DesignsComponent {

  constructor(
    private session: SessionService, 
    private presetService: PresetService, 
    private router: Router){}
  presets: Preset[] = []

  ngOnInit(): void{
    this.loadDesigns();
  }

  loadDesigns(): void{
    let user: User = this.session.getCurrentUser();
    if(!user){
      alert('Session Expired. Login Again');
      this.router.navigate(['/login']);
      return;
    }
    this.presetService.getDesigns(user.id).subscribe({
      next: (response) => {
        console.log('Presets Loaded', response);
        this.presets = response
      },
      error: (err) => {
          this.router.navigate(['/'])
      }})
  }

  createDesign(): void{
    let user: User = this.session.getCurrentUser();
    if(!user){
      alert('Session Expired. Login Again');
      this.router.navigate(['/login']);
    }
    let data = {
      name: 'Sample',
      model: 'chair',
      size: 7,
      color: '#FDE47D'
    }

    this.presetService.createDesign(user.id, data).subscribe({
      next: (response) => {
        if(response){

          console.log('Presets Created', response);
          this.router.navigate(['/design/'+response.id]);
        }
      },
      error: (err) => {
          this.router.navigate(['/'])
      }})
  }
}
