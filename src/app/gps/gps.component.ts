import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

declare const L: any;

@Component({
  selector: 'app-gps',
  templateUrl: './gps.component.html',
  styleUrls: ['./gps.component.css']
})
export class GpsComponent implements OnInit {
  myMap: any = null;
  tabPresenters: any = [];
  tabCurrentVisitPresenter: any = [];
  tabMedecins: any = [];
  tabCurrentVisitMedecin: any = [];
  tabMedecinsLocations: any = [];

  constructor(private ApiService: ApiService, private AuthService: AuthService) { }

  ngOnInit(): void {
    if (!navigator.geolocation) {
      console.log('location is not supported !');
    }

    this.SetMap();

    //this.watchPosition();
  }

  SetMap(){
    navigator.geolocation.getCurrentPosition((position) => {
      this.myMap = L.map('map').setView([position.coords.latitude, position.coords.longitude], 13);

      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2hhbmtzLWUiLCJhIjoiY2wxcm9jMmo5MXdsNDNrbzJ1aTJzMDNzaCJ9.z6f6JHVdNAzUuBcaYjFYdg', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'your.mapbox.access.token'
      }).addTo(this.myMap);

      let myMarker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(this.myMap)
      myMarker.bindPopup('<b>Votre position actuelle</b>').openPopup();

      this.DisplayMedecinsToVisit();

      // Routes
      /*L.Routing.control({
        waypoints: [
          L.latLng(position.coords.latitude, position.coords.longitude),
          L.latLng(57.6792, 11.949),
          L.latLng(58.6792, 11.949)
        ],
        routeWhileDragging: true
      }).addTo(myMap);*/
    });
  }

  watchPosition() {
    let destLat = 0;
    let destLong = 0;
    let id = navigator.geolocation.watchPosition((position) => {
      console.log(`latitude: ${position.coords.latitude}, longitude: ${position.coords.longitude}`);

      if (position.coords.latitude === destLat && position.coords.longitude === destLong) {
        navigator.geolocation.clearWatch(id);
      }
    }, (error) => {
      console.log(error);
    }, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    })
  }

  DisplayMedecinsToVisit() {
    let AnneeMois = this.getMonthTwoDigits();

    this.ApiService.GetAllPresenters().subscribe((Presenters: any) => {
      this.ApiService.GetAllMedecins().subscribe((Medecins: any) => {
        this.ApiService.GetAllMedicaments().subscribe((Medicaments: any) => {

          // on récupère uniquement les présenters du visiteur connecté (obligé de le faire ici car impossible de déclarer AuthService (pour récupérer l'id du visiteur connecté) dans ApiService car circular depedency)
          this.GetPresentersForCurrentVisiteur(Presenters, AnneeMois)

          // on récupère les objets médecins à visiter qui correspondent aux id_medecin des objets presenter(pour le visiteur connecté)
          this.GetMedecinsFromPresenters(Medecins)

          let i = 0;
          this.tabCurrentVisitMedecin.forEach((UnMedecinVisit: any) => {

            // conversion adresse en latitude/longitude puis affichage de markers correspondant aux médecins à visiter sur la map
            this.ApiService.GetMedecinLocation(UnMedecinVisit.Adresse + ", " + UnMedecinVisit.Ville).subscribe((UnMedecinLocation: any) => {
              
              // récupération des médicaments à présenter pour chaque médecin
              let CurrentMedecinMedicaments = this.GetMedicamentsToPresentByMedecin(Medicaments, UnMedecinVisit, AnneeMois)
            
              // ajout Marker et PopUp pour chaque médecin à visiter
              this.AddMarkerAndPopUp(UnMedecinLocation, UnMedecinVisit, CurrentMedecinMedicaments, i);
              i++;
            });
          });
        });
      });
    });
  }

  GetPresentersForCurrentVisiteur(sPresenters: any, sAnneeMois: any){
    sPresenters.forEach((UnPresenter: any) => {
      if (UnPresenter.Id_visit == this.AuthService.currentVisiteur.Id && UnPresenter.AnneeMois === sAnneeMois) {
        this.tabCurrentVisitPresenter.push(UnPresenter);
      }
    });
  }

  GetMedecinsFromPresenters(sMedecins: any){
    this.tabCurrentVisitPresenter.forEach((UnPresenterVisit: any) => {
      sMedecins.forEach((UnMedecin: any) => {
        if (UnMedecin.Id === UnPresenterVisit.Id_medecin) {
          // ce if else => pour éviter les doublons dans le tableau des médecins à visiter
          if (this.tabCurrentVisitMedecin.length > 0) {
            let alreadyExists = false;
            this.tabCurrentVisitMedecin.forEach((UnMedecinVisit: any) => {
              if (UnMedecinVisit.Id === UnMedecin.Id) {
                alreadyExists = true;
              }
            });
            if (alreadyExists === false) {
              this.tabCurrentVisitMedecin.push(UnMedecin);
            }
          } else {
            this.tabCurrentVisitMedecin.push(UnMedecin);
          }
        }
      });
    });
  }

  GetMedicamentsToPresentByMedecin(sMedicaments: any, sUnMedecinVisit: any, sAnneeMois: any){
    let MedicamentsRetour = ""
    sMedicaments.forEach((UnMedicament: any) => {
      this.tabCurrentVisitPresenter.forEach((UnPresenterVisit: any) => {
        if (UnMedicament.Id === UnPresenterVisit.Id_med && sUnMedecinVisit.Id === UnPresenterVisit.Id_medecin && UnPresenterVisit.AnneeMois === sAnneeMois) {
          MedicamentsRetour += "<li>" + UnMedicament.Nom + "</li>";
        }
      });
    });

    return MedicamentsRetour
  }

  AddMarkerAndPopUp(sUnMedecinLocation: any, sUnMedecinVisit: any, sCurrentMedecinMedicaments: any, i: number){
    let MedecinLocationMarker = L.marker([sUnMedecinLocation[0].lat, sUnMedecinLocation[0].lon], {opacity: this.SetMarkerOpacity(this.tabCurrentVisitPresenter[i].IsVisite)}).bindPopup(
      "<b>Nom du médecin</b> : " +
      sUnMedecinVisit.Nom +
      " " +
      sUnMedecinVisit.Prenom +
      "<br><br>" +
      "<b>Médicaments à présenter</b> :" +
      "<ul>" +
      sCurrentMedecinMedicaments +
      "</ul>" +
      "<a href='http://localhost/akagami/Github/PPE_finAnnee_BTS/PPE-examen_PHP/seConnecter.php?sLogin=" + this.AuthService.currentVisiteur.Login + "&sMdp=" + this.AuthService.currentVisiteur.Mdp + "' target='__blank' class='btn btn-info'>Voir plus</a>" +
      "<br><br>" +
      this.SetInputCheckBox(this.tabCurrentVisitPresenter[i].IsVisite, i));
    MedecinLocationMarker.addTo(this.myMap);
  }

  SetInputCheckBox(sIsVisite: boolean, i: number){
    let inputChecked = "";
    if(sIsVisite){
      inputChecked = `<label for='isVisite${i}'>Visité &nbsp</label><input name='isVisite${i}' id='isVisite${i}' type='checkbox' checked (click)='this.test()'>`
    }else{
      inputChecked = `<label for='isVisite${i}'>Visité &nbsp</label><input name='isVisite${i}' id='isVisite${i}' type='checkbox' (click)='this.test()'>`
    }
    return inputChecked
  }

  SetMarkerOpacity(sIsVisite: boolean){
    let opacity = 0;
    if(sIsVisite){
      opacity = 0.5
    }else{
      opacity = 1
    }
    return opacity
  }

  test(){
    alert('ok')
  }

  getMonthTwoDigits() {
    let date = new Date();

    if (date.getMonth() + 1 < 10) {
      return date.getFullYear() + "0" + (date.getMonth() + 1)
    } else {
      return date.getFullYear() + "" + (date.getMonth() + 1)
    }
  }
}
