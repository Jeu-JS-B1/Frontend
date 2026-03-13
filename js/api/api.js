// Le backend tourne sur le port 3000, le frontend sur le port 8080
const API_URL = 'http://localhost:3000/api';

export async function demarrerCombat(playerId) {
    const res = await fetch(`${API_URL}/combat/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId })
    });
    return res.json();
}

export async function envoyerAction(combatId, action) {
    const res = await fetch(`${API_URL}/combat/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ combatId, action })
    });
    return res.json();
}
