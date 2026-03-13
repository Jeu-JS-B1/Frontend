export class HUD {
    constructor(app) {
        // conteneur dédié au HUD
        this.container = new PIXI.Container();
        app.stage.addChild(this.container);

        // txt
        this.tourTexte = this.creerTexte(20, 20);
        this.statsTexte = this.creerTexte(20, 50);
        this.messageTexte = this.creerTexte(20, window.innerHeight - 50);
    }

    // crée le texte a une position donnée
    creerTexte(x, y) {
        const texte = new PIXI.Text({
            text: '',
            style: { fill: 0xffffff, fontSize: 18 }
        });
        texte.x = x;
        texte.y = y;
        this.container.addChild(texte);
        return texte;
    }

    // met a jour l'indicateur de tour
    updateTour(combattant) {
        this.tourTexte.text = `Tour : ${combattant.nom}`;
    }

    // met a jour la barre de stats (points de vie, d'action, de mouvement)
    updateStats(combattant) {
        this.statsTexte.text = `PV: ${combattant.pv}/${combattant.pvMax}  |  PA: ${combattant.pa}/${combattant.paMax}  |  PM: ${combattant.pm}/${combattant.pmMax}`;
    }

    // affiche un message en bas de l'écran
    afficherMessage(texte) {
        this.messageTexte.text = texte;
    }
}
