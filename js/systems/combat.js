import { demarrerCombat, envoyerAction } from '../api/api.js';
import { MovementAnimator } from './movementAnimator.js';
import { TileHighlighter } from './tileHighlighter.js';

export class CombatSystem {

    constructor(player, ennemis, grille, hud, onCombatEnd) {
        this.player = player;
        this.ennemis = ennemis;
        this.hud = hud;
        this.onCombatEnd = onCombatEnd; // callback(vainqueur) appelé en fin de combat

        this.animator = new MovementAnimator();
        this.highlighter = new TileHighlighter(grille);

        this.combatId = null;
        this.tourDuJoueur = false;
    }

    async init() {

        const data = await demarrerCombat(1);
        this.combatId = data.combatId;
        this.tourDuJoueur = true;

        this.syncCombattants(data.combattants);
        this.highlighter.afficherCasesDepuisListe(data.casesAtteignables);
        this.highlighter.afficherCasesAttaqueDepuisListe(
            this.getEnnemisAPortee(data.combattants)
        );

        this.hud.updateTour({ nom: 'Joueur' });
        this.hud.updateStats(data.combattants[0]);
    }

    async handleClick(cellX, cellY) {

        if (this.animator.enAnimation) return;
        if (!this.tourDuJoueur) return;

        const ennemi = this.getEnnemiSurCase(cellX, cellY);
        if (ennemi && this.highlighter.estCaseAttaque(cellX, cellY)) {
            await this.envoyerAttaque(ennemi.id);
            return;
        }

        if (this.highlighter.estCaseAtteignable(cellX, cellY)) {
            await this.envoyerDeplacement(cellX, cellY);
        }
    }

    async envoyerDeplacement(x, y) {

        this.highlighter.effacerTout();

        const resultat = await envoyerAction(this.combatId, { type: 'move', x, y });

        if (resultat.error) {
            console.warn(resultat.error);
            return;
        }

        await this.animerChemin(this.player, resultat.chemin);
        this.player.setPosition(x, y);

        if (resultat.statsJoueur) this.hud.updateStats(resultat.statsJoueur);

        if (resultat.casesAtteignables) {
            this.highlighter.afficherCasesDepuisListe(resultat.casesAtteignables);
        }
        this.highlighter.afficherCasesAttaqueDepuisListe(
            this.getEnnemisAPorteeMaintenant(resultat.statsJoueur)
        );
    }

    async envoyerAttaque(cibleId) {

        const resultat = await envoyerAction(this.combatId, { type: 'attack', cibleId });

        if (resultat.error) {
            console.warn(resultat.error);
            return;
        }

        const cible = this.getCombattantParId(cibleId);
        cible.pv = resultat.ciblePV;
        this.flashDegats(cible);
        this.hud.afficherMessage(`Joueur inflige ${resultat.degats} dégâts !`);

        if (resultat.mort) {
            cible.sprite.visible = false;
            this.hud.afficherMessage(`${cible.nom} est vaincu !`);
        }

        if (resultat.combatTermine) {
            this.finDeCombat(resultat.vainqueur);
            return;
        }

        if (resultat.statsJoueur) this.hud.updateStats(resultat.statsJoueur);

        this.highlighter.effacerTout();
        if (resultat.casesAtteignables) {
            this.highlighter.afficherCasesDepuisListe(resultat.casesAtteignables);
        }
        this.highlighter.afficherCasesAttaqueDepuisListe(
            this.getEnnemisAPorteeMaintenant(resultat.statsJoueur)
        );
    }

    async finTourJoueur() {

        if (this.animator.enAnimation) return;
        if (!this.tourDuJoueur) return;

        this.highlighter.effacerTout();
        this.tourDuJoueur = false;

        const resultat = await envoyerAction(this.combatId, { type: 'end-turn' });

        if (resultat.combatTermine) {
            this.finDeCombat(resultat.vainqueur);
            return;
        }

        if (resultat.actionsEnnemi && resultat.actionsEnnemi.length > 0) {
            this.hud.updateTour({ nom: 'Gobelin' });
            await this.animerActionsEnnemi(resultat.actionsEnnemi);
        }

        if (resultat.tourDe === 'joueur') {
            this.tourDuJoueur = true;
            this.hud.updateTour({ nom: 'Joueur' });

            if (resultat.casesAtteignables) {
                this.highlighter.afficherCasesDepuisListe(resultat.casesAtteignables);
            }
            this.highlighter.afficherCasesAttaqueDepuisListe(
                this.getEnnemisAPorteeMaintenant(null)
            );
            if (resultat.statsJoueur) this.hud.updateStats(resultat.statsJoueur);
        }
    }

    animerChemin(combattant, chemin) {

        return new Promise(resolve => {
            this.animator.lancerDeplacementDirect(combattant, chemin, resolve);
        });
    }

    async animerActionsEnnemi(actions) {

        for (const action of actions) {

            if (action.type === 'move') {
                const ennemi = this.getCombattantParId(action.combattantId);
                await this.animerChemin(ennemi, action.chemin);
                ennemi.setPosition(action.chemin[action.chemin.length - 1].x, action.chemin[action.chemin.length - 1].y);
            }

            if (action.type === 'attack') {
                const cible = this.getCombattantParId(action.cibleId);
                cible.pv = action.ciblePV;
                this.flashDegats(cible);
                this.hud.afficherMessage(`Gobelin inflige ${action.degats} dégâts !`);

                if (action.mort) {
                    cible.sprite.visible = false;
                }
                if (action.combatTermine) {
                    this.finDeCombat(action.vainqueur);
                    return;
                }

                await new Promise(r => setTimeout(r, 500));
            }
        }
    }

    flashDegats(cible) {

        cible.sprite.tint = 0xff0000;
        setTimeout(() => { cible.sprite.tint = 0xffffff; }, 200);
    }

    finDeCombat(vainqueur) {

        this.highlighter.effacerTout();
        this.tourDuJoueur = false;
        this.hud.afficherMessage(vainqueur === 'joueur' ? 'VICTOIRE !' : 'DÉFAITE...');

        // Retour au monde ouvert après un court délai pour lire le message
        setTimeout(() => {
            if (this.onCombatEnd) this.onCombatEnd(vainqueur);
        }, 2000);
    }

    syncCombattants(combattants) {

        for (const data of combattants) {
            const c = this.getCombattantParId(data.id);
            if (c) {
                c.pv = data.pv;
                c.pa = data.pa;
                c.pm = data.pm;
            }
        }
    }

    getEnnemiSurCase(x, y) {

        return this.ennemis.find(e => e.pv > 0 && e.grilleX === x && e.grilleY === y) || null;
    }

    getCombattantParId(id) {

        if (id === 0) return this.player;
        return this.ennemis.find(e => e.id === id) || null;
    }

    getEnnemisAPortee(combattants) {

        const joueur = combattants.find(c => c.equipe === 'joueur');
        if (!joueur) return [];
        return this.ennemis.filter(e => {
            if (e.pv <= 0) return false;
            const dist = Math.abs(e.grilleX - joueur.grilleX) + Math.abs(e.grilleY - joueur.grilleY);
            return dist <= joueur.porteeAttaque && joueur.pa >= 3;
        });
    }

    getEnnemisAPorteeMaintenant(statsJoueur) {

        const pa = statsJoueur ? statsJoueur.pa : this.player.pa;
        const portee = this.player.porteeAttaque || 3;
        return this.ennemis.filter(e => {
            if (e.pv <= 0) return false;
            const dist = Math.abs(e.grilleX - this.player.grilleX) + Math.abs(e.grilleY - this.player.grilleY);
            return dist <= portee && pa >= 3;
        });
    }

    update() {

        this.animator.update();
    }
}
