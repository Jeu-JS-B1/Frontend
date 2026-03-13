const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;

// Sert tous les fichiers statiques du dossier courant (index.html, css/, js/)
app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
    console.log(`Frontend disponible sur http://localhost:${PORT}`);
});
