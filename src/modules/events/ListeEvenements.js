import React, { useState, useEffect } from 'react';
import TuileEvent from './TuileEvent';

function formatDate(dateString) {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', options);
}

const ListeEvenements = ({ estAdmin, statut }) => {
    const [evenements, setEvenements] = useState([]);

    useEffect(() => {
        const recupererEvenements = async () => {
            const url = statut === 'passe' ? 'http://localhost:3000/evenementPasse' : 'http://localhost:3000/evenement';
            try {
                const reponse = await fetch(url);
                if (reponse.ok) {
                    const data = await reponse.json();
                    setEvenements(data);
                    console.log('Contenu de la base de données :', data);
                } else {
                    console.error('Erreur lors de la récupération des événements');
                }
            } catch (error) {
                console.error(error);
            }
        };

        recupererEvenements();
    }, [estAdmin, statut]); // Ecoute les changements de estAdmin

    return (
        <div>
            <div className="liste-tuiles">
                {evenements.map(evenement => {
                    const dateDebut = formatDate(evenement.date_debut);
                    const dateFin = evenement.date_fin !== '0000-00-00' && evenement.date_fin !== null ? formatDate(evenement.date_fin) : null;
                    const date = dateFin ? `${dateDebut} - ${dateFin}` : `${dateDebut} - En cours`;
                    return (
                        <TuileEvent
                            ID={evenement.ID}
                            titre={evenement.titre}
                            lieu={evenement.lieu}
                            date={date}
                            description={evenement.description}
                            lien={evenement.lien}
                            image={evenement.image}
                            estAdmin={estAdmin} 
                            status={new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric', year: 'numeric' }) > new Date(evenement.date_fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric', year: 'numeric' }) && evenement.date_fin !== null ? 'over' : ''}                        />
                    );
                })}
            </div>  
        </div>
    );
};

export default ListeEvenements;
