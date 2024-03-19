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
            adminConnected: false
    };

    componentDidMount() {
        this.checkLoginStatus(); // Vérifie immédiatement l'état de connexion au chargement du composant
        this.interval = setInterval(this.checkLoginStatus, 5000); // Vérifie l'état de connexion toutes les 5 secondes
    }
    
    componentWillUnmount() {
        clearInterval(this.interval); // Nettoie l'intervalle lors du démontage du composant pour éviter les fuites de mémoire
    }
    

    checkLoginStatus = async () => {
        try {
            const response = await fetch('/checkLoginStatus');
            const data = await response.json();
            this.setState({ adminConnected: data.adminConnected });
        } catch (error) {
            console.error('Erreur lors de la vérification de l\'état de connexion :', error);
        }
    };

    handleLogout = async () => {
        try {
            await fetch('/logout', { method: 'POST' }); // Une route pour déconnecter l'utilisateur
            this.setState({ adminConnected: false });
            window.location.reload();
        } catch (error) {
            console.error('Erreur lors de la déconnexion :', error);
        }
    };

    render() {
        const { adminConnected } = this.state;
        const connectLabel = adminConnected ? "Connecté" : null;
        const logoutButton = adminConnected ? (
            <button onClick={this.handleLogout}>Déconnexion</button>
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
                        <div className="module-navbar-row-menu-lien module-navbar-row-menu-lien-margin-left">
                            {connectLabel}
                            {logoutButton}
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
