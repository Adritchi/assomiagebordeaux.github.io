import React, { useState, useEffect } from 'react';

function ImageDropdown({ name, placeholder, value, onChange }) {
    const handleImageChange = (e) => {
        const selectedImage = e.target.value;
        onChange({ target: { name, value: selectedImage } });
      };
  const [imageNames, setImageNames] = useState([]);

  useEffect(() => {
    // Fonction pour importer dynamiquement toutes les images du dossier 'x/xX/'
    const importAll = (r) => {
      return r.keys().map((fileName) => ({
        fileName,
        name: fileName.split('/').pop(), // Extraire le nom du fichier sans l'extension
      }));
    };

    // Importer toutes les images du dossier 'x/xX/'
    const images = importAll(require.context('../../assets/images/', false, /\.(png|jpe?g|svg)$/));

    // Extraire les noms des images
    const imageNames = images.map((image) => image.name);

    // Mettre à jour l'état avec les noms des images
    setImageNames(imageNames);
  }, []);

  return (
      <select name={name} value={value} onChange={handleImageChange}>
        {imageNames.map((name, index) => (
          <option key={index} value={name}>{name}</option>
        ))}
      </select>
  );
}

export default ImageDropdown;
