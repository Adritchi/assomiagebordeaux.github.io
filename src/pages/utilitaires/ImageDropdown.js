
import React, { useState, useEffect } from 'react';

function ImageDropdown() {
  const [imageNames, setImageNames] = useState([]);

  useEffect(() => {
    // Fonction pour importer dynamiquement toutes les images du dossier 'x/xX/'
    const importAll = (r) => {
      return r.keys().map((fileName) => ({
        fileName,
        name: fileName.split('/').pop().split('.')[0], // Extraire le nom du fichier sans l'extension
      }));
    };

    // Importer toutes les images du dossier 'x/xX/'
    const images = importAll(require.context('../../assets/images/', false, /.(png|jpe?g|svg)$/));

    // Extraire les noms des images
    const imageNames = images.map((image) => image.name);

    // Mettre à jour l'état avec les noms des images
    setImageNames(imageNames);
  }, []);

  return (
      <select>
        {imageNames.map((name, index) => (
          <option key={index} value={name}>{name}</option>
        ))}
      </select>
  );
}

export default ImageDropdown;