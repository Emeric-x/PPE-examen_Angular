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
  myMap: any;
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

    this.myMap = null

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

    this.watchPosition();
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

  /*GetPresentersByIdVisit() {
    this.ApiService.GetAllPresenters().subscribe(Result => {
      this.tabPresenters = Result;

      this.tabPresenters.forEach((UnPresenter: any) => {
        if (UnPresenter.Id_visit == this.AuthService.currentVisiteur.Id) {
          this.tabCurrentVisitPresenter.push(UnPresenter);
        }
      });
    });
  }

  GetMedecinsByPresenter() {
    this.ApiService.GetAllMedecins().subscribe(Result => {
      this.tabMedecins = Result;

      this.tabCurrentVisitPresenter.forEach((UnPresenter: any) => {
        this.tabMedecins.forEach((UnMedecin: any) => {
          if (UnMedecin.Id === UnPresenter.Id_medecin) {
            if (this.tabCurrentVisitMedecin.length > 0) { // ce if else => pour éviter les doublons dans le tableau
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
    });
  }

  GetMedecinsPresenterLocations() {
    /*this.tabCurrentVisitMedecin.forEach((UnMedecinLocation: any) => {
      this.ApiService.GetMedecinLocation(UnMedecinLocation.Adresse + ", " + UnMedecinLocation.Ville).subscribe(Result => {
        this.tabMedecinsLocations.push(Result);
      });
    });
    this.ApiService.GetMedecinLocation("3 avenue de la gare, Cluses").subscribe(Result => {
      this.tabCurrentVisitMedecin.forEach((UnMedecinVisit: any) => {
        this.ApiService.GetMedecinLocation(UnMedecinVisit.Adresse + ", " + UnMedecinVisit.Ville).subscribe(Result => {
          this.tabMedecinsLocations.push(Result);

          this.tabMedecinsLocations.forEach((MedecinLocation: any) => {
            let MedecinLocationMarker = L.marker([MedecinLocation[0].lat, MedecinLocation[0].lon]).bindPopup(UnMedecinVisit.Nom + " " + UnMedecinVisit.Prenom);
            MedecinLocationMarker.addTo(this.myMap);
          });
        });
      });
    });
  }*/

  DisplayMedecinsToVisit() {
    let AnneeMois = this.getMonthTwoDigits();

    this.ApiService.GetAllPresenters().subscribe((Presenters: any) => {
      this.ApiService.GetAllMedecins().subscribe((Medecins: any) => {
        this.ApiService.GetAllMedicaments().subscribe((Medicaments: any) => {
          Presenters.forEach((UnPresenter: any) => {
            // on récupère uniquement les présenters du visiteur connecté (obligé de le faire ici car impossible de déclarer AuthService (pour récupérer l'id du visiteur connecté) dans ApiService car circular depedency)
            if (UnPresenter.Id_visit == this.AuthService.currentVisiteur.Id && UnPresenter.AnneeMois === AnneeMois) {
              this.tabCurrentVisitPresenter.push(UnPresenter);
            }
          });

          this.tabCurrentVisitPresenter.forEach((UnPresenterVisit: any) => {
            Medecins.forEach((UnMedecin: any) => {
              // on récupère les objets médecins à visiter (pour le visiteur connecté)
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

          let i = 0;
          this.tabCurrentVisitMedecin.forEach((UnMedecinVisit: any) => {
            // conversion adresse en latitude/longitude puis affichage du marker sur la map
            this.ApiService.GetMedecinLocation(UnMedecinVisit.Adresse + ", " + UnMedecinVisit.Ville).subscribe((UnMedecinLocation: any) => {
              let CurrentMedecinMedicaments = "";
              Medicaments.forEach((UnMedicament: any) => {
                this.tabCurrentVisitPresenter.forEach((UnPresenterVisit: any) => {
                  if (UnMedicament.Id === UnPresenterVisit.Id_med && UnMedecinVisit.Id === UnPresenterVisit.Id_medecin && UnPresenterVisit.AnneeMois === AnneeMois) {
                    CurrentMedecinMedicaments += "<li>" + UnMedicament.Nom + "</li>";
                  }
                });
              });

            
              // ajout PopUp pour chaque marker médecin affiché sur la map
              this.AddPopUpOnMarker(UnMedecinLocation, UnMedecinVisit, CurrentMedecinMedicaments, i);
              i++;
            });
          });
        });
      });
    });
  }

  AddPopUpOnMarker(sUnMedecinLocation: any, sUnMedecinVisit: any, sCurrentMedecinMedicaments: any, i: number){
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
      "<a href='http://localhost/akagami/Github/PPE_finAnnee_BTS/PPE-examen_PHP/seConnecter.php?sLogin=" + this.AuthService.currentVisiteur.Login + "&sMdp=" + this.AuthService.currentVisiteur.Mdp + "' target='__blank'>Voir plus</a>" +
      "<br><br>" +
      this.SetInputCheckBox(this.tabCurrentVisitPresenter[i].IsVisite, i));
    MedecinLocationMarker.addTo(this.myMap);
  }

  SetInputCheckBox(sIsVisite: boolean, i: number){
    let inputChecked = "";
    if(sIsVisite){
      inputChecked = `<label for='isVisite${i}'>Visité &nbsp</label><input name='isVisite${i}' id='isVisite${i}' type='checkbox' checked (click)='this.test()'>`
    }else{
      inputChecked = `<label for='isVisite${i}'>Visité &nbsp</label><input name='isVisite${i}' id='isVisite${i}' type='checkbox'>`
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
