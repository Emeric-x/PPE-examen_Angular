import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deconnexion',
  templateUrl: './deconnexion.component.html',
  styleUrls: ['./deconnexion.component.css']
})
export class DeconnexionComponent implements OnInit {

  constructor(private AuthService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
  }

  signOutUser() {
    this.AuthService.isAuth = false;
    this.router.navigate(['/Connexion']);
  }
}
