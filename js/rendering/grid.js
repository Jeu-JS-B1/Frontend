import { GRID_SIZE } from '../constants.js';
import { grilleVersEcran } from '../utils/coordinates.js';
import { dessinerTile, getCouleurTile } from './tile.js';

export function creerGrille(mapContainer) {
    const grille = [];

    for (let gx = 0; gx < GRID_SIZE; gx++) {
        grille[gx] = [];
        for (let gy = 0; gy < GRID_SIZE; gy++) {
            const tile = creerTileAPosition(gx, gy);
            mapContainer.addChild(tile);
            grille[gx][gy] = tile;
        }
    }

    return grille;
}

function creerTileAPosition(gx, gy) {
    const pos = grilleVersEcran(gx, gy);
    const tile = new PIXI.Graphics();

    dessinerTile(tile, getCouleurTile(gx, gy));
    tile.x = pos.x;
    tile.y = pos.y;
    tile.zIndex = gx + gy;

    return tile;
}
