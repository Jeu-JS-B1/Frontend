import { grilleVersEcran } from '../utils/coordinates.js';

export class Combatant {
    
    constructor(grilleX, grilleY, config, mapContainer) {

        this.grilleX = grilleX;
        this.grilleY = grilleY;
        this.nom = config.nom;

        this.pvMax = config.pvMax;
        this.pv = config.pvMax;
        this.paMax = config.paMax;
        this.pa = config.paMax;
        this.pmMax = config.pmMax;
        this.pm = config.pmMax;
        this.degats = config.degats;
        this.porteeAttaque = config.porteeAttaque;

        this.sprite = this.creerSprite(config.couleur);
        this.updatePosition();
        mapContainer.addChild(this.sprite);
    }

    creerSprite(couleur) {

        const sprite = new PIXI.Graphics();
        sprite.rect(-12, -40, 24, 40);
        sprite.fill(couleur);
        return sprite;
    }

    updatePosition() {

        const pos = grilleVersEcran(this.grilleX, this.grilleY);
        this.sprite.x = pos.x;
        this.sprite.y = pos.y;
        this.sprite.zIndex = this.grilleX + this.grilleY + 0.5;
    }

    setPosition(grilleX, grilleY) {

        this.grilleX = grilleX;
        this.grilleY = grilleY;
        this.updatePosition();
    }

    setSpritePosition(x, y, zIndex) {

        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.zIndex = zIndex;
    }

    debutTour() {

        this.pa = this.paMax;
        this.pm = this.pmMax;
    }

    depenserPM(cout) {

        this.pm -= cout;
    }

    depenserPA(cout) {

        this.pa -= cout;
    }

    subirDegats(montant) {

        this.pv -= montant;
        if (this.pv < 0) this.pv = 0;
    }

    estMort() {

        return this.pv <= 0;
    }

    estAPortee(cible, portee) {

        const distance = Math.abs(this.grilleX - cible.grilleX) + Math.abs(this.grilleY - cible.grilleY);
        return distance <= portee;
    }

}