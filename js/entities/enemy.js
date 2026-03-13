import { Combatant } from './combatant.js';

const ENEMY_CONFIG = {

    nom: 'Gobelin',
    pvMax: 50,
    paMax: 6,
    pmMax: 3,
    degats: 10,
    porteeAttaque: 1,
    couleur: 0xff4444
}

export class Enemy extends Combatant {

    constructor(grilleX, grilleY, mapContainer) {
        super(grilleX, grilleY, ENEMY_CONFIG, mapContainer);
        this.id = 1;
    }
}