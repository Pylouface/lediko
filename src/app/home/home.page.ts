import { Component } from '@angular/core';
import { Partie, Joueur, Manche, Definition, Mot } from '../interfaces/parties';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
    
    
    public Parties = <Partie>[];
    public ListeDeMots = <Mot>[];
    public currentPartie = 0;
    public currentMjId = 0;
    public currentManche = 0;
    public currentMjpos = -1;
    public CurrentlocationMot = 0;
    public zone_a_afficher = "new_game";
    
    // ______________________________________________________________________________
    constructor() {
        this.Initialisation.call(this);
    }
    
    
    // ______________________________________________________________________________
    Initialisation(){
        var mot=<Mot>{};
        mot.id = 1;
        mot.nom = "Maison";        
        mot.definition = "Endroit ou dormir";
        this.ListeDeMots.push(mot);

        var mot2=<Mot>{};
        mot2.id = 2;
        mot2.nom = "Dortoir";        
        mot2.definition = "Endroit commun ou dormir";
        this.ListeDeMots.push(mot2);

        var mot3=<Mot>{};
        mot3.id = 3;
        mot3.nom = "M.Le chat";
        mot3.definition = "Gros enculé de c'est mort";        
        this.ListeDeMots.push(mot3);      
        
        
        var newPartie = <Partie>{};
        newPartie.fini = false;
        newPartie.joueurs = [];
        newPartie.manches = [];
        
        var joueur1 = <Joueur>{};
        joueur1.id = 1;
        joueur1.nom = "Test1";
        joueur1.points = 0;
        
        var joueur2 = <Joueur>{};
        joueur2.id = 2;
        joueur2.nom = "Test2";
        joueur2.points = 0;
        
        var joueur3 = <Joueur>{};
        joueur3.id = 3;
        joueur3.nom = "Test3";
        joueur3.points = 0;
        
        
        newPartie.joueurs.push(joueur1);
        newPartie.joueurs.push(joueur2);
        newPartie.joueurs.push(joueur3);
        console.log(this.Parties);
        this.Parties.push(newPartie);
        
    }
    
    // ______________________________________________________________________________
    public NewRound(){
        // TODO détécté la fin du jeu
        console.log("Show time !");
        console.log(this.Parties);
        
        this.currentMjpos += 1;
        this.currentMjId = this.Parties[this.currentPartie].joueurs[this.currentMjpos].id;        
        var round = <Manche>{};
        this.currentManche +=  1;
        round.idMaitreDuJeu = this.currentMjId;
        round.numTour = this.currentManche;    
        round.idMotADeviner = 0;
        round.definitions = <Definition>[];
        this.Parties[this.currentPartie].manches.push(round);
        this.zone_a_afficher = "maitre_du_jeu";
    }
    
    // ______________________________________________________________________________
    public NewPlayer(){
        var joueur = <Joueur>{};
        joueur.id = this.Parties[this.currentPartie].joueurs.length + 1;
        joueur.nom = "";
        joueur.points = 0;
        this.Parties[this.currentPartie].joueurs.push(joueur);
    }
    
    // ______________________________________________________________________________
    public VersLaSelectionDuProchainMot(){
        this.CurrentlocationMot = Math.floor((Math.random() * this.ListeDeMots.length) + 1) - 1;
        console.log(this.ListeDeMots[this.CurrentlocationMot]);
        
        this.zone_a_afficher = "validation_mot";
    }
    
    
    // ______________________________________________________________________________
    public ValideMot(){
        this.Parties[this.currentPartie].manches[this.currentManche -1].idMotADeviner = this.ListeDeMots[this.CurrentlocationMot].id;
        
        this.JoueurSuivant();
    }
    
    // ______________________________________________________________________________
    public JoueurSuivant(){
        console.log("JoueurSuivant");
    }
    
    
    // ______________________________________________________________________________
    public TODO(){
        console.log("a faire");
    }
    
    
}
    /*
export interface Partie {
    fini:    boolean;
    joueurs: Joueur[];
    manches: Manche[];
}

export interface Joueur {
    id:     number;
    nom:    string;
    points: number;
}

export interface Manche {
    definitions:   Definition[];
    idMaitreDuJeu: number;
    idMotADeviner: number;
    numTour:       number;
}

export interface Definition {
    definition:        string;
    idJoueur:          number;
    idJoueursVotePour: number[];
}


export interface Mot {
    id:        number;
    nom:       string;
    definition: string;
}

*/


