import { COULEUR_TILE_ATTAQUE, COULEUR_STROKE_ATTAQUE } from '../constants.js';
import { dessinerTile, getCouleurTile } from '../rendering/tile.js';

export class TileHighlighter {

    constructor(grille) {

        this.grille = grille;
        this.tilesAtteignables = [];
        this.tilesAttaque = [];
    }

    afficherCasesDepuisListe(cases) {

        this.effacerCasesAtteignables();

        for (const c of cases) {
            const tile = this.grille[c.x][c.y];
            dessinerTile(tile, 0x4444aa, 0x3333aa);
            this.tilesAtteignables.push({ x: c.x, y: c.y });
        }
    }

    afficherCasesAttaqueDepuisListe(ennemis) {

        this.effacerCasesAttaque();

        for (const ennemi of ennemis) {
            const tile = this.grille[ennemi.grilleX][ennemi.grilleY];
            dessinerTile(tile, COULEUR_TILE_ATTAQUE, COULEUR_STROKE_ATTAQUE);
            this.tilesAttaque.push({ x: ennemi.grilleX, y: ennemi.grilleY });
        }
    }

    effacerCasesAtteignables() {

        for (const c of this.tilesAtteignables) {

            dessinerTile(this.grille[c.x][c.y], getCouleurTile(c.x, c.y));
        }

        this.tilesAtteignables = [];
    }

    effacerCasesAttaque() {

        for (const c of this.tilesAttaque) {

            dessinerTile(this.grille[c.x][c.y], getCouleurTile(c.x, c.y));
        }

        this.tilesAttaque = [];
    }

    effacerTout() {

        this.effacerCasesAtteignables();
        this.effacerCasesAttaque();
    }

    estCaseAtteignable(x, y) {

        return this.tilesAtteignables.some(c => c.x === x && c.y === y);
    }

    estCaseAttaque(x, y) {
        
        return this.tilesAttaque.some(c => c.x === x && c.y === y);
    }
}
