import React, { useState } from "react";
import axios from "axios";

function AjouterFilm() {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [realisateur, setRealisateur] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("/api/films", {
        titre: titre,
        description: description,
        realisateur: realisateur,
      });

      console.log("Response:", response.data);
      alert("Le film a été ajouté avec succès");

      setTitre("");
      setDescription("");
      setRealisateur("");
    } catch (error) {
      console.error("Erreur lors de l'ajout du film:", error);
      alert("Une erreur s'est produite lors de l'ajout du film");
    }
  };

  return (
    <div>
      <h2>Ajouter un Film</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Titre:</label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Réalisateur:</label>
          <input
            type="text"
            value={realisateur}
            onChange={(e) => setRealisateur(e.target.value)}
          />
        </div>
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
}

export default AjouterFilm;
