const express = require('express');
const path = require('path');
const loginRoutes = require('./login'); // Importez les routes de login.js
const eventRoutes = require('./event'); // Importer les routes de event.js


const port = 3000;
const app = express();

app.use(express.static(path.join(__dirname, '../build')));

app.use(express.json());

// Route 
app.use('/', loginRoutes);
app.use('/events', eventRoutes);

// Route pour les autres requêtes, renvoie index.html

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:` + port);
});
