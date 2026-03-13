// Système de déplacement en monde ouvert
// Le joueur se déplace librement par clic (lerp fluide comme dans le TMP)
// Cliquer sur un ennemi déclenche le passage en mode combat

export class OverworldSystem {

    constructor(app, onCombatStart) {
        this.app = app;
        this.onCombatStart = onCombatStart; // callback(enemy) appelé quand on clique sur un ennemi

        this.container = new PIXI.Container();
        app.stage.addChild(this.container);

        // Position courante et cible du joueur (screen coords)
        this.player = {
            x: app.screen.width / 2,
            y: app.screen.height / 2,
            targetX: app.screen.width / 2,
            targetY: app.screen.height / 2,
            w: 40,
            h: 80,
            sprite: null
        };

        // Ennemis du monde ouvert (id correspond à l'id utilisé en combat)
        this.enemies = [
            { id: 1, x: 300,  y: 200, w: 40, h: 80, alive: true, sprite: null },
            { id: 2, x: 700,  y: 350, w: 40, h: 80, alive: true, sprite: null },
            { id: 3, x: 500,  y: 500, w: 40, h: 80, alive: true, sprite: null },
        ];

        this.active = false;
        this._construireSprites();
        this._gererClics();
    }

    _construireSprites() {

        // Sprite joueur (rectangle bleu)
        const playerGfx = new PIXI.Graphics();
        playerGfx.rect(0, 0, this.player.w, this.player.h);
        playerGfx.fill(0x4466ff);
        playerGfx.x = this.player.x;
        playerGfx.y = this.player.y;
        this.container.addChild(playerGfx);
        this.player.sprite = playerGfx;

        // Sprites ennemis (rectangles rouges)
        for (const ennemi of this.enemies) {
            const gfx = new PIXI.Graphics();
            gfx.rect(0, 0, ennemi.w, ennemi.h);
            gfx.fill(0xff4444);
            gfx.x = ennemi.x;
            gfx.y = ennemi.y;
            this.container.addChild(gfx);
            ennemi.sprite = gfx;
        }
    }

    _gererClics() {

        this._handler = (e) => {
            if (!this.active) return;

            const { x, y } = e.global;

            // Vérifier si on a cliqué sur un ennemi
            for (const ennemi of this.enemies) {
                if (!ennemi.alive) continue;
                if (x >= ennemi.x && x <= ennemi.x + ennemi.w &&
                    y >= ennemi.y && y <= ennemi.y + ennemi.h) {
                    this.onCombatStart(ennemi);
                    return;
                }
            }

            // Sinon, déplacer le joueur vers le point cliqué
            this.player.targetX = x - this.player.w / 2;
            this.player.targetY = y - this.player.h / 2;
        };

        this.app.stage.on('pointerdown', this._handler);
    }

    marquerEnnemiVaincu(ennemid) {

        const ennemi = this.enemies.find(e => e.id === ennemid);
        if (ennemi) {
            ennemi.alive = false;
            ennemi.sprite.visible = false;
        }
    }

    show() {
        this.active = true;
        this.container.visible = true;
    }

    hide() {
        this.active = false;
        this.container.visible = false;
    }

    update() {
        if (!this.active) return;

        // Lerp fluide vers la position cible (même logique que le TMP)
        this.player.x += (this.player.targetX - this.player.x) * 0.08;
        this.player.y += (this.player.targetY - this.player.y) * 0.08;

        this.player.sprite.x = this.player.x;
        this.player.sprite.y = this.player.y;
    }
}
