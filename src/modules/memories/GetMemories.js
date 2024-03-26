import React, { useState, useEffect } from 'react';
import TuileMemories from './TuileMemories';

function formatDate(dateString) {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', options);
}

const ListMemories = ({ estAdmin }) => {
    const [memories, setMemories] = useState([]);

    useEffect(() => {
        const fetchMemories = async () => {
            try {
                const response = await fetch('http://localhost:3000/memory');
                if (response.ok) {
                    const data = await response.json();
                    setMemories(data);
                    console.log('Contenu de la base de données :', data);
                } else {
                    console.error('Erreur lors de la récupération des souvenirs');
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchMemories();
    }, [estAdmin]); // Ecoute les changements de estAdmin

    return (
        <div>
            <div className="liste-tuiles">
                {memories.map(memory => {
                    const dateDebut = formatDate(memory.date_debut);
                    const dateFin = memory.date_fin !== '0000-00-00' && memory.date_fin !== null ? formatDate(memory.date_fin) : null;
                    const date = dateFin ? `${dateDebut} - ${dateFin}` : `${dateDebut} - En cours`;
                    return (
                        <TuileMemories
                            ID={memory.ID}
                            titre={memory.titre}
                            date={date}
                            description={memory.description}
                            lien={memory.lien}
                            image={memory.image}
                            estAdmin={estAdmin} 
                        />
                    );
                })}
            </div>  
        </div>
    );
};

export default ListMemories;
