import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.css']
})
export class AuthentificationComponent implements OnInit {
  signInForm!: FormGroup;
  errorMessage: string = '';

  constructor(private FormBuilder: FormBuilder, 
              public authService: AuthService, 
              private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.signInForm = this.FormBuilder.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  onSubmit(){
    const login = this.signInForm.get('login')?.value;
    const password = this.signInForm.get('password')?.value;
    this.authService.signInUser(login, password).then(
      () => {
        this.router.navigate(['/ListeVisiteurs']);
      },
      (error) => {
        this.errorMessage = error;
      }
    );
  }
}
