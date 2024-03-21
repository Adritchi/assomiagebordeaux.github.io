// const express = require('express');
// const connection = require('./connection');
// const router = express.Router();

// const bannedIPs = {}; // Stocke les IPs bannies et le temps jusqu'à la fin du bannissement

// let adminConnected = false;
// let ip = "";

// // Fonction pour vérifier si l'IP est bannie
// const isIPBanned = (ip) => {
//     if (bannedIPs[ip] && bannedIPs[ip] > Date.now()) {
//         return true;
//     }
//     return false;
// };

// // Ajouter cette route dans app.js
// router.get('/checkIPBanned', (req, res) => {
//     const ip = req.ip;
//     if (isIPBanned(ip)) {
//         return res.status(200).json({ banned: true });
//     } else {
//         return res.status(200).json({ banned: false });
//     }
// });

// router.get('/banIP', (req, res) => {
//     bannedIPs[req.ip] = Date.now() + 3600000;
//     console.log(bannedIPs);
//     return;
// });

// router.post('/login', (req, res) => {
//     // Vérifier si l'IP est bannie
//     if (isIPBanned(req.ip)) {
//         return res.status(403).json({ status: "error", message: "Vous êtes banni. Réessayez plus tard." });
//     }

//     const sql = "SELECT * FROM Utilisateur WHERE identifiant = ? AND password = ?";
//     const values = [
//         req.body.id,
//         req.body.password
//     ]
//     connection.query(sql, values, (err, data) => {
//         if (err) return res.status(500).json({ status: "error", message: "Erreur interne du serveur" });
//         if (data.length > 0) {
//             ip = req.ip;
//             adminConnected = true;
//             return res.status(200).json({ status: "success", message: "Connexion réussie" });
//         } else {
//             return res.status(401).json({ status: "error", message: "Identifiant ou mot de passe incorrect" });
//         }
//     });
// });

// router.get('/checkLoginStatus', (req, res) => {
//     if (req.ip === ip) {
//         return res.json({ adminConnected: adminConnected }); // Renvoie l'état actuel de adminConnected
//     } else {
//         return res.json({ adminConnected: false });;
//     }
// });

// router.post('/logout', (req, res) => {
//     ip = "";
//     console.log(ip);
//     adminConnected = false; // Réinitialise la variable adminConnected à false lors de la déconnexion
//     res.sendStatus(200); // Envoie une réponse indiquant que la déconnexion a réussi
// });

// module.exports = router;
