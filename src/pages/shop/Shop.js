import React, {Component} from 'react';

import ShopIllustration from '../../assets/images/shop.jpg';

import CreateProduct from '../../modules/shop/CreateProduct';
import ListProduct from '../../modules/shop/GetProduct';

import '../../assets/design/pages/shop.css';

class Shop extends Component {

    // Initialisation de l'état local
    state = {
        estAdmin: false, 
        showCreateProductForm: false, 
    };

    componentDidMount() {
        this.checkLoginStatus(); // Vérifie immédiatement l'état de connexion
    }

    // Vérifie le statut de connexion
    checkLoginStatus = async () => {
        try {
            // Requête pour vérifier le statut de connexion côté serveur
            const response = await fetch('/checkLoginStatus');
            const data = await response.json();
            // Met à jour l'état estAdmin avec le résultat de la requête
            this.setState({ estAdmin: data.adminConnected });
        } catch (error) {
            // En cas d'erreur, laisse estAdmin sur false
            this.setState({ estAdmin: false });
        }
    };

    // Bascule l'affichage du formulaire de création d'événement
    toggleCreateProductForm = () => {
        this.setState((prevState) => ({
            showCreateProductForm: !prevState.showCreateProductForm,
        }));
    };

    render() {
        const { estAdmin } = this.state;
        return (
            <div class="page-shop">
                <div style={{backgroundImage: "url(" + ShopIllustration + ")"}} class="page-shop-illustration">
                    <div class="page-shop-illustration-infos">
                        <div class="page-shop-illustration-infos-titre">Shop AMB</div>
                        <div class="page-shop-illustration-infos-subtitle">La panoplie complète du bon miagiste</div>
                    </div>
                </div>
                <div class="page-shop-content">
                    {estAdmin && (
                        <button onClick={this.toggleCreateProductForm}>Créer un produit</button>
                    )}
                        {this.state.showCreateProductForm && <CreateProduct />}
                    <div class="page-shop-articles">
                        <ListProduct estAdmin={estAdmin}/>
                    </div>
                    <div id="page-shop-conditions" class="page-shop-conditions">
                        Le shop AMB ne s'occupe que des goodies et vêtements vendus par l'Asso MIAGE Bordeaux,
                        pour les réservations d'évènements (WEI, WES...etc), dirigez vous vers la page "Events".
                        La commande en ligne n'est en réalité qu'un paiement en ligne. Ce paiement s'effectue via
                        HelloAsso, une solution de gestion de billeterie destinée aux associations. Il s'agit d'un
                        site sécurisé, les différents moyens de paiement acceptés sont : Carte bancaire. Il n'est
                        possible actuellement de venir commander au local de l'Asso MIAGE Bordeaux. Les produits
                        commandés sont
                        à récupérer après d'un membre de l'Asso MIAGE Bordeaux.
                    </div>
                </div>
            </div>
        );
    }
}

export default Shop