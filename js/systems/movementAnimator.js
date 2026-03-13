import { grilleVersEcran } from '../utils/coordinates.js';

export class MovementAnimator {

    constructor() {

        this.enAnimation = false;
        this.cheminActuel = null;
        this.etapeChemin = 0;
        this.progression = 0;
        this.combattantAnime = null;
        this.callbackFinDeplacement = null;
    }

    lancerDeplacementDirect(combattant, chemin, callback) {

        if (!chemin || chemin.length < 2) {

            if (callback) callback();
            return;
        }

        this.cheminActuel = chemin;
        this.etapeChemin = 0;
        this.progression = 0;
        this.combattantAnime = combattant;
        this.callbackFinDeplacement = callback;
        this.enAnimation = true;
    }

    update() {

        if (!this.enAnimation || !this.cheminActuel) return;

        this.progression += 0.08;

        if (this.progression >= 1) {

            this.progression = 0;
            this.etapeChemin++;

            this.combattantAnime.setPosition(

                this.cheminActuel[this.etapeChemin].x,
                this.cheminActuel[this.etapeChemin].y
            );

            if (this.etapeChemin >= this.cheminActuel.length - 1) {

                this.enAnimation = false;
                this.cheminActuel = null;

                if (this.callbackFinDeplacement) {

                    this.callbackFinDeplacement();
                }

                return;
            }

        } else {
            const from = grilleVersEcran(

                this.cheminActuel[this.etapeChemin].x,
                this.cheminActuel[this.etapeChemin].y
            );
            const to = grilleVersEcran(
                
                this.cheminActuel[this.etapeChemin + 1].x,
                this.cheminActuel[this.etapeChemin + 1].y
            );

            const x = from.x + (to.x - from.x) * this.progression;
            const y = from.y + (to.y - from.y) * this.progression;

            const fromZ = this.cheminActuel[this.etapeChemin].x + this.cheminActuel[this.etapeChemin].y;
            const toZ = this.cheminActuel[this.etapeChemin + 1].x + this.cheminActuel[this.etapeChemin + 1].y;
            const zIndex = fromZ + (toZ - fromZ) * this.progression + 0.5;

            this.combattantAnime.setSpritePosition(x, y, zIndex);
        }
    }
}
