import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/admin.css";

function Admin() {
  const [films, setFilms] = useState([]);
  const [filmCount, setFilmCount] = useState(0);
  const [cinemaCount, setCinemaCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const response = await axios.get("/api/films");
        if (
          response.data &&
          response.data._embedded &&
          response.data._embedded.films
        ) {
          setFilms(response.data._embedded.films);
          setFilmCount(response.data._embedded.films.length);
        } else {
          console.error("Aucun film trouvé dans la réponse.");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des films :", error);
      }
    };

    const fetchCinemas = async () => {
      try {
        const response = await axios.get("/api/cinemas");
        if (
          response.data &&
          response.data._embedded &&
          response.data._embedded.cinemas
        ) {
          setCinemaCount(response.data._embedded.cinemas.length);
        } else {
          console.error("Aucun cinéma trouvé dans la réponse.");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des cinémas :", error);
      }
    };

    fetchFilms();
    fetchCinemas();
  }, []);

  return (
    <div className="admin-container">
      <div className="side-menu">
        <div className="category-buttons">
          <button
            onClick={() => handleCategoryChange("film")}
            className={selectedCategory === "film" ? "active" : ""}
          >
            Films
          </button>
          <button
            onClick={() => handleCategoryChange("cinema")}
            className={selectedCategory === "cinema" ? "active" : ""}
          >
            Cinemas
          </button>
        </div>
      </div>
      <div className="content">
        {selectedCategory === "film" && (
          <>
            <h2>Table: Films</h2>
            <table>
              <thead>
                <tr>
                  <th>Photo</th>
                </tr>
              </thead>
              <tbody>
                {films.map((film) => (
                  <tr key={extractFilmId(film._links.self.href)}>
                    <td>
                      <img
                        src={film.photo}
                        alt={film.titre}
                        style={{ width: "50px" }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {selectedCategory === "cinema" && (
          <>
            <h2>Table: Cinemas</h2>
            {/* afficher les cinémas */}
          </>
        )}
        {selectedCategory === null && (
          <>
            <p>Nombre de films: {filmCount}</p>
            <p>Nombre de cinémas: {cinemaCount}</p>
          </>
        )}
      </div>
    </div>
  );
}

const extractFilmId = (url) => {
  const parts = url.split("/");
  return parts[parts.length - 1];
};

export default Admin;
