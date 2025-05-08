import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SessionService } from '../../services/sessionService';
import { UserService } from '../../services/userService';
import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-contact-us',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css',
  providers: [SessionService, UserService]
})
export class ContactUsComponent{

  constructor(private api: UserService, private session: SessionService) {}

  Error = false;
  success = false;
  Admin = false;


  info: Contact [] = []

  ngOnInit(): void {
    const user = this.session.getCurrentUser();
    this.api.getrole({"username": user.username}).subscribe({
      next: (response) => {
        if(response.data.role == 'admin'){
          this.Admin = true;
          this.getDetails();
        }
      }, error: (err) => {
        console.error(err);
      }
    })
  }



  ContactUsForm = new FormGroup({
    Fname: new FormControl('',[Validators.required]),
    Lname: new FormControl(''),
    email: new FormControl('' , [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    description: new FormControl('')
  })

  onSubmit(){
    this.Error = false;
    this.success = false;
    if(this.ContactUsForm.invalid){
      this.Error = true;
      return
    }

    const parser = {'Fname': this.ContactUsForm.value.Fname, 'Lname': this.ContactUsForm.value.Lname,
                    'email': this.ContactUsForm.value.email, 'phnNumber': this.ContactUsForm.value.phoneNumber,
                    'description': this.ContactUsForm.value.description}
    
    this.api.createContact(parser).subscribe({
      next: (response) => {
        this.success = true;
        setTimeout(() => {
          window.location.reload();
        }, 3000)
      }, error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    })
  }

  getDetails(){
    this.api.getContact().subscribe({
      next: (response) => {
        console.log(response)
        this.info = response;
      }, error: (err) => {
        console.log(err);
      }
    })
  }

  accept(id: any){
    this.api.setStatus({'id': id}).subscribe({
      next: (response) => {
        window.location.reload();
      }, error: (err) => {
        window.location.reload();
      }
    })
  }

}
