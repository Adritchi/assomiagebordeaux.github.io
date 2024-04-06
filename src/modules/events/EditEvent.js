import React, { useState } from 'react';

const editerEvenement = ({ evenement }) => {
    const [evenementMiseAJour, setEvenementMiseAJour] = useState(evenement);
    const [erreur, setErreur] = useState(false);
    const [erreurDate, setErreurDate] = useState(false);

    const gererChangementEntree = (element) => {
        const { name, value } = element.target;
        setEvenementMiseAJour(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const gererChangementImage = (element) => {
        const fichierImage = element.target.files[0];
        const lecteur = new FileReader();
        lecteur.onload = () => {
            setEvenementMiseAJour(prevState => ({
                ...prevState,
                image: lecteur.result // Mettre à jour l'image avec le contenu base64
            }));
        };
        lecteur.readAsDataURL(fichierImage);
    };

    const gererEnvoiEdition = async () => {
        try {
            setErreur(false);
            if (evenementMiseAJour.titre === '' || evenementMiseAJour.lieu === '' || evenementMiseAJour.date_debut === '1970-01-01' || evenementMiseAJour.description === '' || evenementMiseAJour.lien === '') {
                setErreur(true);
                return;
            }
            if (evenementMiseAJour.date_fin && evenementMiseAJour.date_fin < evenementMiseAJour.date_debut) {
                setErreurDate(true);
                return;
            }
            const reponse = await fetch(`http://localhost:3000/evenement/${evenement.ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(evenementMiseAJour),
            });

            if (reponse.ok) {
                console.log('Événement mis à jour avec succès');
                setErreurDate(false);
                setErreur(false);
                window.location.reload();
            } else {
                console.error('Erreur lors de la mise à jour de l\'événement');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={gererChangementImage} />
            <br></br>
            <br></br>
            <input type="text" name="titre" value={evenementMiseAJour.titre} onChange={gererChangementEntree} />
            <input type="text" name="lieu" value={evenementMiseAJour.lieu} onChange={gererChangementEntree} />
            <input type="date" name="date_debut" value={evenementMiseAJour.date_debut} onChange={gererChangementEntree} />
            <input type="date" name="date_fin" value={evenementMiseAJour.date_fin} onChange={gererChangementEntree} />
            <input type="text" name="description" value={evenementMiseAJour.description} onChange={gererChangementEntree} />
            <input type="text" name="lien" value={evenementMiseAJour.lien} onChange={gererChangementEntree} />
            <br></br>
            <br></br>
            <button onClick={gererEnvoiEdition}>Enregistrer les modifications</button>
            
            {/* Rendu conditionnel du label d'erreur */}
            {erreur && (
                <div style={{ color: 'red' }}>
                    <p>Veuillez remplir tous les champs</p>
                </div>
            )}
            {erreurDate && (
                <div style={{ color: 'red' }}>
                    <p>Veuillez entrer des dates valides</p>
                </div>
            )}
        </div>
    );
};

export default editerEvenement;
