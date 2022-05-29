import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-liste-medicaments',
  templateUrl: './liste-medicaments.component.html',
  styleUrls: ['./liste-medicaments.component.css']
})
export class ListeMedicamentsComponent implements OnInit {
  displayedColumns: string[] = ['Nom', 'Photo', 'Description', 'Categorie'];
  listMedicaments: any = []

  constructor(private ApiService: ApiService) { }

  ngOnInit(): void {
    this.ApiService.GetAllMedicaments().subscribe(Result => {
      this.listMedicaments = Result
    })
  }

}
