import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditerEvenement = ({ evenement }) => {
    const [evenementMiseAJour, setEvenementMiseAJour] = useState(evenement);
    const [erreur, setErreur] = useState(false);
    const [erreurDate, setErreurDate] = useState(false);
    const [updatedSuccess, setUpdatedSuccess] = useState(false);

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
                setUpdatedSuccess(true); // Success
                setErreurDate(false);
                setErreur(false);
                setTimeout(() => {
                    window.location.reload();
                }, 2000); // Attente de 3 secondes
            } else {
                console.error('Erreur lors de la mise à jour de l\'événement');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container my-4">
            <form>
                <div className="mb-3">
                    <label htmlFor="image" className="form-label">Image</label>
                    <input className="form-control" type="file" id="image" accept="image/*" onChange={gererChangementImage} />
                </div>
                <div className="mb-3">
                    <label htmlFor="titre" className="form-label">Titre</label>
                    <input className="form-control" type="text" id="titre" name="titre" value={evenementMiseAJour.titre} onChange={gererChangementEntree} />
                </div>
                <div className="mb-3">
                    <label htmlFor="lieu" className="form-label">Lieu</label>
                    <input className="form-control" type="text" id="lieu" name="lieu" value={evenementMiseAJour.lieu} onChange={gererChangementEntree} />
                </div>
                <div className="row g-3">
                    <div className="col">
                        <label htmlFor="date_debut" className="form-label">Date de début</label>
                        <input className="form-control" type="date" id="date_debut" name="date_debut" value={evenementMiseAJour.date_debut} onChange={gererChangementEntree} />
                    </div>
                    <div className="col">
                        <label htmlFor="date_fin" className="form-label">Date de fin</label>
                        <input className="form-control" type="date" id="date_fin" name="date_fin" value={evenementMiseAJour.date_fin} onChange={gererChangementEntree} />
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea className="form-control" id="description" name="description" rows="3" value={evenementMiseAJour.description} onChange={gererChangementEntree}></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="lien" className="form-label">Lien</label>
                    <input className="form-control" type="url" id="lien" name="lien" value={evenementMiseAJour.lien} onChange={gererChangementEntree} />
                </div>
                <div className="d-grid gap-2">
                    <button className="module-tuileEvent-info-buttons-button2" type="button" onClick={gererEnvoiEdition}>Enregistrer les modifications</button>
                </div>
            </form>
            {updatedSuccess && (
                <div className="alert alert-success" role="alert">
                    L'événement a été modifié avec succès !
                </div>
            )}
            {erreur && <div className="alert alert-danger">Veuillez remplir tous les champs.</div>}
            {erreurDate && <div className="alert alert-danger">Veuillez entrer des dates valides.</div>}
        </div>
    );
};

export default EditerEvenement;
