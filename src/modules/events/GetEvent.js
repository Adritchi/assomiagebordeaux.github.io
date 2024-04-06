import React, { useState, useEffect } from 'react';
import TuileEvent from './TuileEvent';

function formatDate(dateString) {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', options);
}

const listeEvenement = ({ estAdmin, statut }) => {
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
                {evenements.map(event => {
                    const dateDebut = formatDate(event.date_debut);
                    const dateFin = event.date_fin !== '0000-00-00' && event.date_fin !== null ? formatDate(event.date_fin) : null;
                    const date = dateFin ? `${dateDebut} - ${dateFin}` : `${dateDebut} - En cours`;
                    return (
                        <TuileEvent
                            ID={event.ID}
                            titre={event.titre}
                            lieu={event.lieu}
                            date={date}
                            description={event.description}
                            lien={event.lien}
                            image={event.image}
                            estAdmin={estAdmin} 
                            status={new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric', year: 'numeric' }) > new Date(event.date_fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric', year: 'numeric' }) && event.date_fin !== null ? 'over' : ''}                        />
                    );
                })}
            </div>  
        </div>
    );
};

export default listeEvenement;
