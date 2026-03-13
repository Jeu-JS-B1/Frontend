import { GRID_SIZE, TILE_HEIGHT } from './constants.js';
import { creerGrille } from './rendering/grid.js';
import { Player } from './entities/player.js';
import { Enemy } from './entities/enemy.js';
import { HUD } from './ui/hud.js';
import { CombatSystem } from './systems/combat.js';
import { InputSystem } from './systems/input.js';
import { OverworldSystem } from './systems/overworld.js';

// crée un canvas plein écran avec un fond sombre
async function initApp() {
    const app = new PIXI.Application();
    await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        background: 0x1a1a2e
    });
    document.body.appendChild(app.canvas);
    app.stage.eventMode = 'static';
    app.stage.hitArea = app.screen;
    return app;
}

// crée le conteneur isométrique du combat (caché au départ)
function creerMapContainer(app) {
    const mapContainer = new PIXI.Container();
    mapContainer.sortableChildren = true;
    app.stage.addChild(mapContainer);
    mapContainer.x = window.innerWidth / 2;
    mapContainer.y = window.innerHeight / 2 - (GRID_SIZE - 1) * (TILE_HEIGHT / 2);
    return mapContainer;
}

async function init() {
    const app = await initApp();
    const hud = new HUD(app);

    // Conteneur combat — caché jusqu'à ce qu'un combat commence
    const mapContainer = creerMapContainer(app);
    mapContainer.visible = false;

    const grille = creerGrille(mapContainer);
    const player = new Player(2, 2, mapContainer);
    const ennemi1 = new Enemy(7, 7, mapContainer);

    // Référence au CombatSystem actif (pour la boucle de jeu)
    let combatActif = null;

    // Monde ouvert — cliquer sur un ennemi déclenche un combat
    const overworld = new OverworldSystem(app, (ennemiOW) => {

        overworld.hide();
        mapContainer.visible = true;
        ennemi1.sprite.visible = true;

        // Créer le système de combat avec callback de retour au monde ouvert
        const inputSystem = new InputSystem(app, mapContainer, null);

        const combat = new CombatSystem(player, [ennemi1], grille, hud, (vainqueur) => {
            combatActif = null;
            inputSystem.destroy();
            mapContainer.visible = false;
            if (vainqueur === 'joueur') overworld.marquerEnnemiVaincu(ennemiOW.id);
            overworld.show();
        });

        inputSystem.combatSystem = combat;
        inputSystem.init();

        combat.init();
        combatActif = combat;
    });

    overworld.show();

    // Boucle de jeu
    app.ticker.add(() => {
        overworld.update();
        if (combatActif) combatActif.update();
    });
}

init();
