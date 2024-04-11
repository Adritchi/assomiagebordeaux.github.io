import React, { useState } from 'react';

const EditerSouvenir = ({ souvenir }) => {
    const [souvenirMiseAJour, setSouvenirMiseAJour] = useState(souvenir);
    const [erreur, setErreur] = useState(false);
    const [erreurDate, setErreurDate] = useState(false);

    const gererChangementEntree = (element) => {
        const { name, value } = element.target;
        setSouvenirMiseAJour(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const gererChangementImage = (element) => {
        const fichierImage = element.target.files[0];
        const lecteur = new FileReader();
        lecteur.onload = () => {
            setSouvenirMiseAJour(prevState => ({
                ...prevState,
                image: lecteur.result // Mettre à jour l'image avec le contenu base64
            }));
        };
        lecteur.readAsDataURL(fichierImage);
    };

    const gererEnvoiEdition = async () => {
        try {
            setErreur(false);
            if (souvenirMiseAJour.titre === '' || souvenirMiseAJour.date_debut === '1970-01-01' || souvenirMiseAJour.description === '' || souvenirMiseAJour.lien === '') {
                setErreur(true);
                return;
            }
            if (souvenirMiseAJour.date_fin && souvenirMiseAJour.date_fin < souvenirMiseAJour.date_debut) {
                setErreurDate(true);
                return;
            }
            // Convertir la date de début en UTC avant de l'enregistrer
            const dateDebutUTC = souvenirMiseAJour.date_debut ? new Date(souvenirMiseAJour.date_debut).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' ');
            // Convertir la date de fin en UTC avant de l'enregistrer (si elle est présente)
            const dateFinUTC = souvenirMiseAJour.date_fin ? new Date(souvenirMiseAJour.date_fin).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' ');
            const reponse = await fetch(`http://localhost:3000/souvenir/${souvenir.ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...souvenirMiseAJour,
                    date_debut: dateDebutUTC,
                    date_fin: dateFinUTC,
                }),
            });

            if (reponse.ok) {
                console.log('Souvenir mis à jour avec succès');
                setErreurDate(false);
                setErreur(false);
                window.location.reload();
            } else {
                console.error('Erreur lors de la mise à jour du souvenir');
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
            <input type="text" name="titre" value={souvenirMiseAJour.titre} onChange={gererChangementEntree} />
            <input type="date" name="date_debut" value={souvenirMiseAJour.date_debut} onChange={gererChangementEntree} />
            <input type="date" name="date_fin" value={souvenirMiseAJour.date_fin} onChange={gererChangementEntree} />
            <input type="text" name="description" value={souvenirMiseAJour.description} onChange={gererChangementEntree} />
            <input type="text" name="lien" value={souvenirMiseAJour.lien} onChange={gererChangementEntree} />
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

export default EditerSouvenir;
