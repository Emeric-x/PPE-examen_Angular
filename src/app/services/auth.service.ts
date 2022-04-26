import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { ApiService } from "./api.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    isAuth: boolean = false;
    tabVisiteur: any = [];
    currentVisiteur : any;

    constructor(private router: Router,
        private ApiService: ApiService) { }

    signInUser(login: string, password: string) {
        return new Promise(
            (resolve, reject) => {
                this.ApiService.GetAllVisiteurs().subscribe(Result => {
                    this.tabVisiteur = Result;

                    this.tabVisiteur.forEach((UnVisiteur: any) => {
                        if (UnVisiteur.Login == login && UnVisiteur.Mdp == password) {
                            this.isAuth = true;
                            this.currentVisiteur = UnVisiteur;
                            resolve(true);
                        }
                    });

                    reject("Votre login ou mot de passe est incorrect.");
                });
            }
        );
    }

    signOutUser() {
        this.isAuth = false;
        this.router.navigate(['/Connexion']);
    }

}