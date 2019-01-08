import { Component } from '@angular/core';
import { Partie, Joueur, Manche, Definition, Mot } from '../interfaces/parties';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

    public Parties: Partie[] = [];
    public ListeDeMots: Mot[] = [];
    public currentPartie = -1;
    public currentMjId = 0;
    public currentManche = 0;
    public currentMjpos = -1;
    public CurrentlocationMot = 0;
    public currentPlayerId = 0;
    public currentPlayerPos = 0;
    public currentDefinition = 0;

    public everyPlayerVote = false;
    public voteSelectedPlayerId = -1;
    public voteSelectedPlayerPos = -1;

    public zone_a_afficher = 'new_game';
    clearTimeOutDuCul = null;

    /*
    TODO : 
    - splash screen
    - <!-- A afficher 2 secondes, full screen, quand la partie commence-->
    <ion-img src="/assets/9.jpg" style="height: 10%;width: 10%" *ngIf="false"></ion-img>
    - attribution d'une couleur à chaque joueur (a chaque fois)
    - manche suivante à centré au tableau
    - si joueur trop long à répondre : playAudio
    */
    
    // ______________________________________________________________________________
    constructor(private splashScreen: SplashScreen) {
        this.Initialisation.call(this);
    }


    // ______________________________________________________________________________
    Initialisation() {
        this.splashScreen.show();
        const mot = <Mot>{};
        mot.id = 1;
        mot.nom = 'Maison';
        mot.definition = 'Endroit ou dormir';
        this.ListeDeMots.push(mot);

        const mot2 = <Mot>{};
        mot2.id = 2;
        mot2.nom = 'Dortoir';
        mot2.definition = 'Endroit commun ou dormir';
        this.ListeDeMots.push(mot2);

        const mot3 = <Mot>{};
        mot3.id = 3;
        mot3.nom = 'M.Le chat';
        mot3.definition = 'Sale bête';
        this.ListeDeMots.push(mot3);


        const newPartie = <Partie>{};
        newPartie.fini = false;
        newPartie.joueurs = [];
        newPartie.manches = [];

        const joueur1 = <Joueur>{};
        joueur1.id = 1;
        joueur1.nom = 'Joueur 1';
        joueur1.points = 0;

        const joueur2 = <Joueur>{};
        joueur2.id = 2;
        joueur2.nom = 'Joueur 2';
        joueur2.points = 0;

        const joueur3 = <Joueur>{};
        joueur3.id = 3;
        joueur3.nom = 'Joueur 3';
        joueur3.points = 0;

        newPartie.joueurs.push(joueur1);
        newPartie.joueurs.push(joueur2);
        newPartie.joueurs.push(joueur3);
        this.currentPartie += 1;
        console.log(this.Parties);
        this.Parties.push(newPartie);
    }

    // ______________________________________________________________________________
    public resetVariable() {
        this.CurrentlocationMot = 0;
        this.currentPlayerId = 0;
        this.currentPlayerPos = 0;
        this.currentDefinition = 0;

        this.everyPlayerVote = false;
        this.voteSelectedPlayerId = -1;
        this.voteSelectedPlayerPos = -1;
    }

    // ______________________________________________________________________________
    public NewRound() {
        this.resetVariable();
        this.currentMjpos += 1;

        this.currentMjId = this.Parties[this.currentPartie].joueurs[this.currentMjpos].id;
        const round = <Manche>{};
        this.currentManche +=  1;
        round.idMaitreDuJeu = this.currentMjId;
        round.numTour = this.currentManche;
        round.idMotADeviner = 0;
        round.definitions = [];
        this.Parties[this.currentPartie].manches.push(round);
        this.zone_a_afficher = 'maitre_du_jeu';

    }

    // ______________________________________________________________________________
    public NewPlayer() {
        const joueur = <Joueur>{};
        joueur.id = this.Parties[this.currentPartie].joueurs.length + 1;
        joueur.nom = '';
        joueur.points = 0;
        this.Parties[this.currentPartie].joueurs.push(joueur);
    }

    // ______________________________________________________________________________
    public VersLaSelectionDuProchainMot() {
        this.CurrentlocationMot = Math.floor((Math.random() * this.ListeDeMots.length) + 1) - 1;
        console.log(this.ListeDeMots[this.CurrentlocationMot]);
        this.zone_a_afficher = 'validation_mot';
    }

    // ______________________________________________________________________________
    public ValideMot() {
        this.Parties[this.currentPartie].manches[this.currentManche - 1].idMotADeviner = this.ListeDeMots[this.CurrentlocationMot].id;
        // On ajoute la définition à la liste de définitions
        const def = <Definition>{};
        def.definition = this.ListeDeMots[this.CurrentlocationMot].definition;
        def.idJoueur = 0;
        def.idJoueursVotePour = [];

        this.Parties[this.currentPartie].manches[this.currentManche - 1].definitions.push(def);
        this.JoueurSuivant();
    }

    // ______________________________________________________________________________
    // Appelé aprés le MJ et aprés chaque joueur
    public JoueurSuivant() {
        this.clearTimeOutDuCul = setTimeout(()=>{ this.playAudio(); }, 1000);
        
        
        let selected = false;
        this.Parties[this.currentPartie].joueurs.forEach((joueur, index) => {
            // Si l'id du joueur != id mj et si > 0 id en cours
            if (joueur.id !== this.currentMjId && joueur.id > this.currentPlayerId && selected === false) {
                this.currentPlayerId = joueur.id;
                this.currentPlayerPos = index;
                selected = true;
            }
        });
        // Si selected == false alors fin de manche
        if (selected) {
            this.currentDefinition += 1;
            const def = <Definition>{};
            def.definition = '';
            def.idJoueur = this.currentPlayerId;
            def.idJoueursVotePour = [];
            this.Parties[this.currentPartie].manches[this.currentManche - 1].definitions.push(def);
            this.zone_a_afficher = 'player_actif';
        } else {
            // Si fin de manche
            this.zone_a_afficher = 'fin_de_manche';
        }
    }

    
    // ______________________________________________________________________________
    public playAudio(){
      console.log("playAudio");
      let audio = new Audio();
      audio.src = "../../assets/TINTIN.wav";
      audio.load();
      audio.play();
    }
    
    // ______________________________________________________________________________
    public Vote() {
        this.zone_a_afficher = 'vote';
    }

    // ______________________________________________________________________________
    public AVoter(indexDefinition) {
        // Recherche si présent dans d'autre definitions
        this.Parties[this.currentPartie].manches[this.currentManche - 1].definitions.forEach((def, index) => {
            const exist = def.idJoueursVotePour.indexOf(this.voteSelectedPlayerId);
            // Si trouver on le supprime
            if (exist !== - 1) {
                def.idJoueursVotePour.splice(exist, 1);
            }
        });

        // On l'ajoute à la liste des vote de la définition
        this.Parties[this.currentPartie].manches[this.currentManche - 1].definitions[indexDefinition].idJoueursVotePour.push(this.voteSelectedPlayerId);

        // On cherche si tt les joueurs ont voté
        this.everyPlayerVote = true;
        let jTrouve = false;

        this.Parties[this.currentPartie].joueurs.forEach((joueur, index) => {
            // Le mj ne vote pas
            if (index !== this.currentMjpos) {
                // tant qu'on trouve que tt les joueurs on voté on continu à chercher
                if (this.everyPlayerVote === true) {
                    jTrouve = false;
                    this.Parties[this.currentPartie].manches[this.currentManche - 1].definitions.forEach(def => {
                        const exist = def.idJoueursVotePour.indexOf(joueur.id);
                        if (exist !== -1) {
                            jTrouve = true;
                        }
                    });
                }
                // Si un joueur à pas voté alors on sort de la boucle
                if (jTrouve === false) {
                   this.everyPlayerVote = false;
                }
            }
        });
    }

    // ______________________________________________________________________________
    public ValideVote() {
        /*
            Regle d'attribution des points :
            Si un joueur à trouvé la bonne définition +1 points
            Si quelqu'un à voté pour la déf d'un autre joueur +1 points pour l'autre joueur
        */
        this.Parties[this.currentPartie].manches[this.currentManche - 1].definitions.forEach((def, index) => {
          def.idJoueursVotePour.forEach(idJ => {
            // l'index du joueur qui à voté
            const indexJoueur = this.FindInPlayer(idJ);
            // Si il à voté pour la bonne définition. (On sais que si l'id du mot == 0 => bonne déf)
            if (def.idJoueur === 0) {
                this.Parties[this.currentPartie].joueurs[indexJoueur].points += 1;
            } else {
              // Si il a voté pour quelqu'un d'autre
              // On récup l'index de l'autre joueur
              const indexJoueur2 = this.FindInPlayer(def.idJoueur);
              this.Parties[this.currentPartie].joueurs[indexJoueur2].points += 2;
            }
          });
        });
        console.log(this.Parties[this.currentPartie].joueurs);
        // si le prochaine mj n'existe pas
        if (typeof this.Parties[this.currentPartie].joueurs[this.currentMjpos + 1] === 'undefined') {
            this.zone_a_afficher = 'fin_partie';
            this.Parties[this.currentPartie].fini = true;
        } else {
            this.zone_a_afficher = 'recap_points';
        }
    }

    // ______________________________________________________________________________
    // Cherche d'id dans les joueurs et renvoie l'index
    public FindInPlayer(idToFind) {
        let toReturn = -1;
        this.Parties[this.currentPartie].joueurs.forEach((joueur, index) => {
            if (joueur.id === idToFind) {
               toReturn = index;
            }
        });
        return toReturn;
    }

    // ______________________________________________________________________________
    public VoteSelectPlayer(idJ, indexJ) {
        this.voteSelectedPlayerId = idJ;
        this.voteSelectedPlayerPos = indexJ;
    }

    // ______________________________________________________________________________
    public DisplayTextArea() {
        this.zone_a_afficher = 'text_area';
    }

    // ______________________________________________________________________________
    public NouvellePartie() {
        // Lance une nouvelle partie avec les mêmes joueurs
        this.currentPartie += 1;
        const newPartie = <Partie>{};
        newPartie.fini = false;
        newPartie.joueurs = [];
        newPartie.manches = [];
        this.Parties.push(newPartie);
        this.Parties[this.currentPartie].joueurs = this.Parties[this.currentPartie - 1].joueurs;

        this.currentMjId = 0;
        this.currentManche = 0;
        this.currentMjpos = -1;
        this.CurrentlocationMot = 0;
        this.currentPlayerId = 0;
        this.currentPlayerPos = 0;
        this.currentDefinition = 0;
        this.everyPlayerVote = false;
        this.voteSelectedPlayerId = -1;
        this.voteSelectedPlayerPos = -1;
        this.NewRound();
    }

    // ______________________________________________________________________________
    public RetourMenu() {
        // Retour au menu
        this.Initialisation();
        this.currentMjId = 0;
        this.currentManche = 0;
        this.currentMjpos = -1;
        this.CurrentlocationMot = 0;
        this.currentPlayerId = 0;
        this.currentPlayerPos = 0;
        this.currentDefinition = 0;
        this.everyPlayerVote = false;
        this.voteSelectedPlayerId = -1;
        this.voteSelectedPlayerPos = -1;
        this.zone_a_afficher = 'new_game';
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


