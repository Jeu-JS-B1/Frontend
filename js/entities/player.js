import { Combatant } from './combatant.js';

const PLAYER_CONFIG = {
    nom: 'Joueur',
    pvMax: 100,
    paMax: 6,
    pmMax: 3,
    degats: 15,
    porteeAttaque: 3,
    couleur: 0x4488ff
}

export class Player extends Combatant {

    constructor(grilleX, grilleY, mapContainer) {
        super(grilleX, grilleY, PLAYER_CONFIG, mapContainer);
        this.id = 0;
    }
}
