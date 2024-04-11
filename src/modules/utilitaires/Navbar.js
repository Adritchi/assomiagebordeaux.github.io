import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import '../../assets/design/commun/navbar.css';
import logo from '../../assets/images/LogoAMB.png';
// import logo from '../images/LogoAMBNovember2.png';

// Fonction qui s'occupe de rendre invisible le menu de la navbar 
// quand celle-ci est en mode smartphone
function hideMenu() {
    var x = document.getElementById("module-navbar-column-menu");
    if (x.style.display === "flex") {
        x.style.display = "none";
    } else {
        x.style.display = "none";
    }
}

class Navbar extends Component {
    
    state = {
            adminConnecte: false
    };

    componentDidMount() {
        this.estAdminConnecte(); // Vérifie immédiatement l'état de connexion au chargement du composant
        this.interval = setInterval(this.estAdminConnecte, 5000); // Vérifie l'état de connexion toutes les 5 secondes
    }
    
    componentWillUnmount() {
        clearInterval(this.interval); // Nettoie l'intervalle lors du démontage du composant pour éviter les fuites de mémoire
    }
    

    estAdminConnecte = async () => {
        try {
            const reponse = await fetch('/estAdminConnecte');
            const donnees = await reponse.json();
            this.setState({ adminConnecte: donnees.adminConnecte });
        } catch (error) {
            console.error('Erreur lors de la vérification de l\'état de connexion :', error);
        }
    };

    gererDeconnexion = async () => {
        try {
            await fetch('/deconnexion', { method: 'POST' }); // Une route pour déconnecter l'utilisateur
            this.setState({ adminConnecte: false });
            window.location.reload();
        } catch (error) {
            console.error('Erreur lors de la déconnexion :', error);
        }
    };

    render() {
        const { adminConnecte } = this.state;
        const messageConnecte = adminConnecte ? (
            <span className="connected-label">Connecté</span>
        ) : null;
        const bouttonDeconnexion = adminConnecte ? (
            <button className="navbar-logout-button" onClick={this.gererDeconnexion}>Déconnexion</button>
        ) : null;

        const data = {
            linkLogo: "/",
            nameFirst: "Accueil", linkFirst: "/",
            nameSecond: "Events", linkSecond: "/events",
            nameThird: "Memories", linkThird: "/memories",
            nameFourth: "Shop", linkFourth: "/shop",
            name5: "ADHÉRER", link5: "/association/adhesion"
        };

        return (
            <div className="module-navbar">
                <div className="module-navbar-row">
                    <div className="module-navbar-row-logo">
                        <Link className="module-navbar-row-logo-img" to={data.linkLogo}><img src={logo} alt="Logo" /></Link>
                    </div>
                    <div className="module-navbar-row-menu">
                        <div className="module-navbar-row-menu-lien">
                            <Link to={data.linkFirst}>{data.nameFirst}</Link>
                        </div>
                        <div className="module-navbar-row-menu-lien module-navbar-row-menu-lien-margin-left">
                            <Link to={data.linkSecond}>{data.nameSecond}</Link>
                        </div>
                        <div className="module-navbar-row-menu-lien module-navbar-row-menu-lien-margin-left">
                            <Link to={data.linkThird}>{data.nameThird}</Link>
                        </div>
                        <div className="module-navbar-row-menu-lien module-navbar-row-menu-lien-margin-left">
                            <Link to={data.linkFourth}>{data.nameFourth}</Link>
                        </div>
                        <div className="module-navbar-row-menu-lien module-navbar-account-actions">
                            {messageConnecte}
                            {bouttonDeconnexion}
                        </div>
                    </div>
                </div>

                <div className="module-navbar-column">
                    <div className="module-navbar-column-first-row">
                        <div className="module-navbabr-column-first-row-logo">
                            <Link className="module-navbabr-column-first-row-logo-img" to={data.linkLogo}><img src={logo} alt="Logo" /></Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Navbar;
