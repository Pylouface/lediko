import { Component } from '@angular/core';
import { Partie, Joueur, Manche, Definition, Mot } from '../interfaces/parties';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
//import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

    public ColorList: string[] = [];
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

    public couleurEnCours = -1;
    public everyPlayerVote = false;
    public voteSelectedPlayerId = -1;
    public voteSelectedPlayerPos = -1;

    public zone_a_afficher = 'new_game';
    clearTimeOutDuCul = null;

    /*
    TODO : 
    - splash screen
    - full screen background
    - double animation
    - réduire taille logo
    - Pied de page (1 seul image)
    - Recentrer au milieu les pages
    
    */
    
    // ______________________________________________________________________________
    constructor(private splashScreen: SplashScreen) {
        this.Initialisation.call(this);
    }

    NextColor(){
        this.couleurEnCours += 1;
        return this.ColorList[this.couleurEnCours];
    }
    
    // ______________________________________________________________________________
    Initialisation() {
        
        this.ColorList.push('secondary');
        
        this.ColorList.push('success');
        this.ColorList.push('danger');
        this.ColorList.push('light');
        this.ColorList.push('dark');
        this.ColorList.push('gray');
        this.ColorList.push('warning');
        console.log(this.SetMot())
        
        this.ListeDeMots = this.SetMot();
        console.log(this.ListeDeMots);
        
        this.splashScreen.show();

        const newPartie = <Partie>{};
        newPartie.fini = false;
        newPartie.joueurs = [];
        newPartie.manches = [];

        const joueur1 = <Joueur>{};
        joueur1.id = 1;
        joueur1.nom = 'Joueur 1';
        joueur1.points = 0;
        joueur1.couleur = this.NextColor();

        const joueur2 = <Joueur>{};
        joueur2.id = 2;
        joueur2.nom = 'Joueur 2';
        joueur2.points = 0;
        joueur2.couleur = this.NextColor();

        const joueur3 = <Joueur>{};
        joueur3.id = 3;
        joueur3.nom = 'Joueur 3';
        joueur3.points = 0;
        joueur3.couleur = this.NextColor();

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
    public AleatoireMot(){
        this.CurrentlocationMot = Math.floor(Math.random() * this.ListeDeMots.length);
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
        
        this.zone_a_afficher = 'DUCUL';
        setTimeout(()=>{ this.zone_a_afficher = 'maitre_du_jeu'; }, 3000);
    }

    // ______________________________________________________________________________
    public NewPlayer() {
        const joueur = <Joueur>{};
        joueur.id = this.Parties[this.currentPartie].joueurs.length + 1;
        joueur.nom = '';
        joueur.points = 0;
        joueur.couleur = this.NextColor();
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
        clearTimeout(this.clearTimeOutDuCul);        
        
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
      audio.src = "../../assets/ascenceur.mp3";
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
                this.Parties[this.currentPartie].joueurs[indexJoueur].points += 2;
            } else {
              // Si il a voté pour quelqu'un d'autre
              // On récup l'index de l'autre joueur
              const indexJoueur2 = this.FindInPlayer(def.idJoueur);
              this.Parties[this.currentPartie].joueurs[indexJoueur2].points += 1;
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
        // Joue un musique si le joueurs pas assez rapide
        this.clearTimeOutDuCul = setTimeout(()=>{ this.playAudio(); }, 60000);
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
        this.Parties[this.currentPartie].joueurs.forEach((joueur, index) => {
            joueur.points = 0;
        });

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
    
    public SetMot():any{
        var mot = 
     [
	{
		"id": "1",
		"nom": "pétrichor",
		"definition": "odeur particulière"
	},
	{
		"id": "2",
		"nom": "brandon",
		"definition": "espèce de flambeau fait avec de la paille tortillée"
	},
	{
		"id": "3",
		"nom": "friselis",
		"definition": "frémissement doux et faible"
	},
	{
		"id": "4",
		"nom": "horion",
		"definition": "Coup violent donné à quelqu'un."
	},
	{
		"id": "5",
		"nom": "alliciant",
		"definition": "Se dit de quelqu'un de séducteur "
	},
	{
		"id": "6",
		"nom": "agape",
		"definition": "repas copieux et joyeux entre amis"
	},
	{
		"id": "7",
		"nom": "thébaïde",
		"definition": "lieu sauvage"
	},
	{
		"id": "8",
		"nom": "baissoir",
		"definition": "Bassin dans lequel est stockée l'eau salée ."
	},
	{
		"id": "9",
		"nom": "callipyge",
		"definition": " personne qui a de belles fesses."
	},
	{
		"id": "10",
		"nom": "futaille",
		"definition": "tonneaux contenant de l'alcool ."
	},
	{
		"id": "11",
		"nom": "hypocoristique",
		"definition": " forme linguistique exprimant une intention affectueuse"
	},
	{
		"id": "12",
		"nom": "accagner",
		"definition": " poursuivre quelqu'un en l'insultant"
	},
	{
		"id": "13",
		"nom": "postéromanie",
		"definition": " l'envie d'avoir des enfants"
	},
	{
		"id": "14",
		"nom": "Isabelle",
		"definition": "Couleur de la robe de certaines races de chevaux"
	},
	{
		"id": "15",
		"nom": "avocette",
		"definition": "Oiseau vivant en troupes"
	},
	{
		"id": "16",
		"nom": "chape-chute",
		"definition": "Bonne aubaine pour une personne suite à la malchance d'une autre."
	},
	{
		"id": "17",
		"nom": "jour-de-souffrance ",
		"definition": "Ouverture qui donne sur la propriété d'un voisin."
	},
	{
		"id": "18",
		"nom": "schlitte",
		"definition": "Sorte de traineau circulant sur des rails en bois"
	},
	{
		"id": "19",
		"nom": "notule",
		"definition": "courte publication"
	},
	{
		"id": "20",
		"nom": "mnémophobie",
		"definition": "Peur des souvenirs."
	},
	{
		"id": "21",
		"nom": "logopède",
		"definition": "Professionnel de la thérapie du langage"
	},
	{
		"id": "22",
		"nom": "berloque",
		"definition": " Signal qui donne au soldat la permission de rompre les rangs."
	},
	{
		"id": "23",
		"nom": "mirliflore",
		"definition": "jeune élégant satisfait de sa personne"
	},
	{
		"id": "24",
		"nom": "croquignole",
		"definition": "Petit biscuit croquant"
	},
	{
		"id": "25",
		"nom": "carabistouille",
		"definition": "personne qui raconte des blagues ou des bêtises"
	},
	{
		"id": "26",
		"nom": "tintinnabuler",
		"definition": "Produire une série de sons aigus et légers."
	},
	{
		"id": "27",
		"nom": "croque-lardon",
		"definition": "parasite"
	},
	{
		"id": "28",
		"nom": "feuilloler",
		"definition": "Se recouvrir de feuilles."
	},
	{
		"id": "29",
		"nom": "margouillis",
		"definition": "mot signifiant une décheterie"
	},
	{
		"id": "30",
		"nom": "accroche-coeur",
		"definition": "mèche de cheveux"
	},
	{
		"id": "31",
		"nom": "songe-malice",
		"definition": "Celui qui fait souvent de mauvais tours."
	},
	{
		"id": "32",
		"nom": "bamboche",
		"definition": "personne de petite taille"
	},
	{
		"id": "33",
		"nom": "gobeloter",
		"definition": "Boire à petits coups en prenant son temps."
	},
	{
		"id": "34",
		"nom": "Bonace",
		"definition": "état d'une mer très calme"
	},
	{
		"id": "35",
		"nom": "vespéral",
		"definition": "se dit d'une chose qui a lieu le soir"
	},
	{
		"id": "36",
		"nom": "rodomont",
		"definition": "personne qui se vante de prétendus actes de bravoure ."
	},
	{
		"id": "37",
		"nom": "mâche-dru",
		"definition": "se dit d'une personne gourmande"
	},
	{
		"id": "38",
		"nom": "margoulin",
		"definition": "mot signifiant un bonnet"
	},
	{
		"id": "39",
		"nom": "lulibérine",
		"definition": "hormone responsable de l'appétit sexuel."
	},
	{
		"id": "40",
		"nom": "abutyrotomofilogène",
		"definition": "Se dit d’un individu simplet."
	},
	{
		"id": "41",
		"nom": "amarsissage",
		"definition": "Action d’amarsir"
	},
	{
		"id": "42",
		"nom": "Circa",
		"definition": "Ce mot est est souvent utilisé pour décrire diverses dates "
	},
	{
		"id": "43",
		"nom": "coprolithe",
		"definition": "Excrément fossilisé."
	},
	{
		"id": "44",
		"nom": "copycat",
		"definition": "Tueur imitant la manière de faire d'un serial killer."
	},
	{
		"id": "45",
		"nom": "dandinette",
		"definition": "un poisson  servant de leurre à la pêche"
	},
	{
		"id": "46",
		"nom": "Jettatura",
		"definition": "action de jeter un mauvais sort"
	},
	{
		"id": "47",
		"nom": "Liteau",
		"definition": "une serviette blanche qui protége les mains du serveur "
	},
	{
		"id": "48",
		"nom": "manustupration",
		"definition": "ancienne forme du mot "
	},
	{
		"id": "49",
		"nom": "Nycthémère",
		"definition": "Période de vingt-quatre heures correspondant à la succession d’une nuit et d’un jour."
	},
	{
		"id": "50",
		"nom": "Ognette",
		"definition": " Ciseau de sculpteur"
	},
	{
		"id": "51",
		"nom": "abator",
		"definition": " ce terme désigne une personne qui a récupéré un héritage"
	},
	{
		"id": "52",
		"nom": "ab hoc et ab hac",
		"definition": "parler d’une manière confuse et désordonnée."
	},
	{
		"id": "53",
		"nom": "abroutir",
		"definition": "Pour un animal"
	},
	{
		"id": "54",
		"nom": "Pipistrelle",
		"definition": "Mot qui désigne une chauve souris"
	},
	{
		"id": "55",
		"nom": "proboscidé",
		"definition": "Animal qui est muni d’une trompe."
	},
	{
		"id": "56",
		"nom": "Procrastination",
		"definition": "Action de reporter"
	},
	{
		"id": "57",
		"nom": "quimboiseur",
		"definition": "Sorcier antillais pratiquant le vaudou "
	},
	{
		"id": "58",
		"nom": "Réifier",
		"definition": "Transformer en chose concrète"
	},
	{
		"id": "59",
		"nom": "Ripperologue",
		"definition": " spécialiste de Jack l'éventreur"
	},
	{
		"id": "60",
		"nom": "Spermophile",
		"definition": "  espèces de rongeurs de la famille des écureuils qui aiment les graines."
	},
	{
		"id": "61",
		"nom": "boulingrin",
		"definition": "Parterre de gazon"
	},
	{
		"id": "62",
		"nom": "brimborion",
		"definition": "Objet sans valeur"
	},
	{
		"id": "63",
		"nom": "cénobite",
		"definition": "Religieux qui vit en communauté."
	},
	{
		"id": "64",
		"nom": "chantepleure",
		"definition": "Robinet d’un tonneau à vin"
	},
	{
		"id": "65",
		"nom": "Cyprine",
		"definition": "Liquide sécrété par le sexe de la femme pendant l'excitation"
	},
	{
		"id": "66",
		"nom": "exobiophilie",
		"definition": "Fait d'être sexuellement attiré par les extraterrestres."
	},
	{
		"id": "67",
		"nom": "hallux",
		"definition": "Mot qui désigne le gros orteil de l'être humain"
	},
	{
		"id": "68",
		"nom": "Hapax",
		"definition": "Mot n'ayant été employé qu'une seule fois dans la littérature"
	},
	{
		"id": "69",
		"nom": "happelourde",
		"definition": "Pierre fausse"
	},
	{
		"id": "70",
		"nom": "hypocoristique",
		"definition": " Qui exprime une intention tendre"
	},
	{
		"id": "71",
		"nom": "impedimenta",
		"definition": "Ce qui empêche l'activité"
	},
	{
		"id": "72",
		"nom": "Ithyphallique",
		"definition": "Se dit d'un homme qui présente un pénis en érection."
	},
	{
		"id": "73",
		"nom": "léthifère",
		"definition": "Qui cause la mort."
	},
	{
		"id": "74",
		"nom": "Odonymie",
		"definition": "ancien terme qui désignait un spécialiste des rues"
	},
	{
		"id": "75",
		"nom": "paltoquet",
		"definition": "Homme grossier"
	},
	{
		"id": "76",
		"nom": "pâmoison",
		"definition": " État de bien-être que l’on ressent lors d’une émotion intense."
	},
	{
		"id": "77",
		"nom": "Papinette",
		"definition": "Cuillère en bois munie d'un long manche."
	},
	{
		"id": "78",
		"nom": "Porion",
		"definition": "Contremaître dans les mines de charbon."
	},
	{
		"id": "79",
		"nom": "primipare",
		"definition": "Se dit d'une femelle qui accouche pour la première fois."
	},
	{
		"id": "80",
		"nom": "Trimammophilie",
		"definition": "l'attirance ou fantasme pour les femmes à trois seins "
	},
	{
		"id": "81",
		"nom": "ulna",
		"definition": "Cubitus"
	},
	{
		"id": "82",
		"nom": "uxoricide",
		"definition": "Homme qui tue sa femme"
	},
	{
		"id": "83",
		"nom": "valétudinaire",
		"definition": "personne qui est souvent malade"
	},
	{
		"id": "84",
		"nom": "Zinzibérin",
		"definition": "Qui a rapport avec le gingembre"
	},
	{
		"id": "85",
		"nom": "zinzinuler",
		"definition": "Parfois utilisé pour décrire le bourdonnement des moustiques."
	},
	{
		"id": "86",
		"nom": "Xalam",
		"definition": "genre de luth en afrique"
	},
	{
		"id": "87",
		"nom": "missi dominici",
		"definition": "Agents du moyen-âge qui assurer le contrôle et la surveillance "
	},
	{
		"id": "88",
		"nom": "béer",
		"definition": "Ouvrir la bouche d’étonnement"
	},
	{
		"id": "89",
		"nom": "circonlocution",
		"definition": "Tourner autour du pot"
	},
	{
		"id": "90",
		"nom": "algarade",
		"definition": "Insulte faite brusquement"
	},
	{
		"id": "91",
		"nom": "amène",
		"definition": "Se dit de quelque chose d'agréable"
	},
	{
		"id": "92",
		"nom": "salmigondis",
		"definition": "Ragoût de diverses sortes de viandes réchauffées."
	},
	{
		"id": "93",
		"nom": "Infundibuliforme",
		"definition": "Qualifiait l’anus de certains sodomistes "
	},
	{
		"id": "94",
		"nom": "chiader",
		"definition": "Préparer un examen."
	},
	{
		"id": "95",
		"nom": "lazzi",
		"definition": "Mauvaises plaisanteries à l’égard de quelqu’un."
	},
	{
		"id": "96",
		"nom": "leptosome",
		"definition": "Personne ou animal possédant des caractéristiques longues."
	},
	{
		"id": "97",
		"nom": "marie-salope",
		"definition": "Petit bâtiment d’une construction particulière"
	},
	{
		"id": "98",
		"nom": "Stercoraire",
		"definition": "Qui a rapport aux excréments."
	},
	{
		"id": "99",
		"nom": "touffeur",
		"definition": "Atmosphère épaisse et lourde dans un lieu chaud"
	},
	{
		"id": "100",
		"nom": "Fesse-Mathieu",
		"definition": "Se dis d'une personne avare"
	},
	{
		"id": "",
		"nom": "",
		"definition": ""
	},
	{
		"id": ""
	}
]   
     
    return mot;    
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


