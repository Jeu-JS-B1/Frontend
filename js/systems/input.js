import { GRID_SIZE } from '../constants.js';
import { ecranVersGrille } from '../utils/coordinates.js';

export class InputSystem {
    constructor(app, mapContainer, combatSystem) {
        this.app = app;
        this.mapContainer = mapContainer;
        this.combatSystem = combatSystem;
    }

    init() {
        this.app.stage.on('pointerdown', (event) => {
            const cell = this.getCellFromEvent(event);
            if (!this.estCelluleValide(cell)) return;
            this.combatSystem.handleClick(cell.x, cell.y);
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'e' || e.key === 'E') {
                this.combatSystem.finTourJoueur();
            }
        });

        this.creerBoutonFinTour();
    }

    creerBoutonFinTour() {
        const btn = document.createElement('button');
        btn.textContent = 'Fin de tour (E)';
        btn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 20px;
            font-size: 16px;
            background: #2244aa;
            color: white;
            border: 2px solid #4466dd;
            border-radius: 6px;
            cursor: pointer;
            z-index: 10;
        `;
        btn.addEventListener('click', () => this.combatSystem.finTourJoueur());
        document.body.appendChild(btn);
        this.boutonFinTour = btn;
    }

    // Supprime le bouton quand on quitte le combat
    destroy() {
        if (this.boutonFinTour) {
            this.boutonFinTour.remove();
            this.boutonFinTour = null;
        }
    }

    getCellFromEvent(event) {
        const relX = event.global.x - this.mapContainer.x;
        const relY = event.global.y - this.mapContainer.y;
        return ecranVersGrille(relX, relY);
    }

    estCelluleValide(cell) {
        return cell.x >= 0 && cell.x < GRID_SIZE && cell.y >= 0 && cell.y < GRID_SIZE;
    }
}
