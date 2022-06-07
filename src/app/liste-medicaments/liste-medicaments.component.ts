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
  copieListMedicaments: any = []
  chaineSaisie = ""
  emptyTab = "Nous n'avons trouvé aucun médicament correspondant à votre filtre."

  constructor(private ApiService: ApiService) { }

  ngOnInit(): void {
    this.ApiService.GetAllMedicaments().subscribe(Result => {
      this.listMedicaments = Result
      this.copieListMedicaments = this.listMedicaments
    })
  }

  triTab(sChaineSaisie: string){
    this.copieListMedicaments = this.listMedicaments
    let tempTab: any = []

    if(sChaineSaisie !== ""){
      this.copieListMedicaments.forEach((unMedicament: any) => {
        for(let i = 0; i<=unMedicament.Nom.length-sChaineSaisie.length; i++){
          if(unMedicament.Nom.substring(i, sChaineSaisie.length+i).toLowerCase() === sChaineSaisie.toLowerCase()){
            tempTab.push(unMedicament)
          }
        }
      });

      this.copieListMedicaments = tempTab
    }

    this.chaineSaisie = ""
  }

}
