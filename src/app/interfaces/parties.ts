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
