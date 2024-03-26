import React, { useState } from 'react';

const EditMemories = ({ memory }) => {
    const [updatedMemory, setUpdatedMemory] = useState(memory);
    const [error, setError] = useState(false);
    const [errorDate, setErrorDate] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedMemory(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const imageFile = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setUpdatedMemory(prevState => ({
                ...prevState,
                image: reader.result // Mettre à jour l'image avec le contenu base64
            }));
        };
        reader.readAsDataURL(imageFile);
    };

    const handleEditSubmit = async () => {
        try {
            setError(false);
            if (updatedMemory.titre === '' || updatedMemory.date_debut === '' || updatedMemory.description === '' || updatedMemory.lien === '') {
                setError(true);
                return;
            }
            if (updatedMemory.date_fin && updatedMemory.date_fin < updatedMemory.date_debut) {
                setErrorDate(true);
                return;
            }
            const response = await fetch(`http://localhost:3000/memory/${memory.ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedMemory),
            });

            if (response.ok) {
                console.log('Souvenir mis à jour avec succès');
                setErrorDate(false);
                setError(false);
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
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <input type="text" name="titre" value={updatedMemory.titre} onChange={handleInputChange} />
            <input type="date" name="date_debut" value={updatedMemory.date_debut} onChange={handleInputChange} />
            <input type="date" name="date_fin" value={updatedMemory.date_fin} onChange={handleInputChange} />
            <input type="text" name="description" value={updatedMemory.description} onChange={handleInputChange} />
            <input type="text" name="lien" value={updatedMemory.lien} onChange={handleInputChange} />
            <button onClick={handleEditSubmit}>Enregistrer les modifications</button>
            
            {/* Rendu conditionnel du label d'erreur */}
            {error && (
                <div style={{ color: 'red' }}>
                    <p>Veuillez remplir tous les champs</p>
                </div>
            )}
            {errorDate && (
                <div style={{ color: 'red' }}>
                    <p>Veuillez entrer des dates valides</p>
                </div>
            )}
        </div>
    );
};

export default EditMemories;
