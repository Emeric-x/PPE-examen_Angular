import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-liste-visiteurs',
  templateUrl: './liste-visiteurs.component.html',
  styleUrls: ['./liste-visiteurs.component.css']
})
export class ListeVisiteursComponent implements OnInit {
  displayedColumns: string[] = ['Nom', 'Prenom', 'Ville', 'Region'];
  listVisiteurs: any = []

  constructor(private ApiService : ApiService) { }

  ngOnInit(): void {
    this.ApiService.GetAllVisiteurs().subscribe(Result => {
      this.listVisiteurs = Result
    })
  }
}
