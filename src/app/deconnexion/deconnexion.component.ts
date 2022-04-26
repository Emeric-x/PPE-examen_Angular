import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-deconnexion',
  templateUrl: './deconnexion.component.html',
  styleUrls: ['./deconnexion.component.css']
})
export class DeconnexionComponent implements OnInit {

  constructor(public AuthService: AuthService) { }

  ngOnInit(): void {
  }

}
