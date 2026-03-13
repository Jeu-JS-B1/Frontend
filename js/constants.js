export const COUT_PA_ATTAQUE = 3;

export const COULEUR_ENNEMI = 0xff4444;
export const COULEUR_TILE_ATTAQUE = 0xaa4444;
export const COULEUR_STROKE_ATTAQUE = 0x883333;

export const TILE_WIDTH = 64;
export const TILE_HEIGHT = 32;

export const GRID_SIZE = 10;

export const VITESSE = 0.05;

export const TILE_SHAPE = [
    0, -TILE_HEIGHT / 2,
    TILE_WIDTH / 2, 0,
    0, TILE_HEIGHT / 2,
    -TILE_WIDTH / 2, 0
];

export const COULEUR_TILE_1 = 0x3a7d3a;
export const COULEUR_TILE_2 = 0x2d6b2d;
export const COULEUR_STROKE = 0x1a5c1a;
export const COULEUR_TILE_ATTEIGNABLE = 0x4444aa;
export const COULEUR_STROKE_ATTEIGNABLE = 0x3333aa;
export const COULEUR_BACKGROUND = 0x1a1a2e;

export const DIRECTIONS = [
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 }
];
