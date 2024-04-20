import React, { useState } from "react";
import axios from "axios";

function AjouterCinema() {
  const [name, setName] = useState("");
  const [nombre_salles, setNombreSalles] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("/api/cinema/add", {
        name: name,
        nombre_salles: parseInt(nombre_salles),
      });

      console.log("Response:", response.data);
      alert("Le cinéma a été ajouté avec succès");
      console.log(response);
    } catch (error) {
      console.error("Erreur lors de l'ajout du cinéma:", error);
      alert("Une erreur s'est produite lors de l'ajout du cinéma");
    }
  };

  return (
    <div>
      <h2>Ajouter Cinema</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <label>Nombre Salles:</label>
        <input
          type="text"
          value={nombre_salles}
          onChange={(e) => setNombreSalles(e.target.value)}
        />
        <br />
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
}

export default AjouterCinema;
