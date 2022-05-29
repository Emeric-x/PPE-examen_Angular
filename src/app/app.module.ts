import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthentificationComponent } from './authentification/authentification.component';
import { AccueilComponent } from './accueil/accueil.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FourOhFourComponent } from './four-oh-four/four-oh-four.component';
import { RouterModule, Routes } from '@angular/router';
import { DeconnexionComponent } from './deconnexion/deconnexion.component';
import { ListeMedicamentsComponent } from './liste-medicaments/liste-medicaments.component';
import { ListeVisiteursComponent } from './liste-visiteurs/liste-visiteurs.component';
import { ListeRapportsComponent } from './liste-rapports/liste-rapports.component';
import { GpsComponent } from './gps/gps.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from './services/api.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';

const appRoutes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'Home', component: AccueilComponent },
  { path: 'Connexion', component: AuthentificationComponent },
  { path: 'Deconnexion', canActivate:[AuthGuard], component: DeconnexionComponent },
  { path: 'ListeMedicaments', canActivate:[AuthGuard], component: ListeMedicamentsComponent },
  { path: 'ListeVisiteurs', canActivate:[AuthGuard], component: ListeVisiteursComponent },
  { path: 'ListeRapports', canActivate:[AuthGuard], component: ListeRapportsComponent },
  { path: 'Map', canActivate:[AuthGuard], component: GpsComponent },
  { path: 'not-found', component: FourOhFourComponent },
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  declarations: [
    AppComponent,
    AuthentificationComponent,
    AccueilComponent,
    NavBarComponent,
    FourOhFourComponent,
    DeconnexionComponent,
    ListeMedicamentsComponent,
    ListeVisiteursComponent,
    ListeRapportsComponent,
    GpsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatTableModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
