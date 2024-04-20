import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import "./css/ListeFilms.css";

function ListeFilms() {
  const [films, setFilms] = useState([]);
  const [currentFilmIndex, setCurrentFilmIndex] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const response = await fetch("/api/films");
        if (response.ok) {
          const data = await response.json();
          if (data._embedded && data._embedded.films) {
            setFilms(data._embedded.films);
            console.log(data._embedded.films);
          } else {
            throw new Error("No films found in the response.");
          }
        } else {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching films:", error);
        setError(error.message);
      }
    };

    fetchFilms();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFilmIndex(prevIndex =>
        prevIndex === films.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [films]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (films.length === 0) {
    return <div>Loading...</div>;
  }

  const currentFilm = films[currentFilmIndex];

  const handlePrev = () => {
    setCurrentFilmIndex(prevIndex =>
      prevIndex === 0 ? films.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentFilmIndex(prevIndex =>
      prevIndex === films.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="liste-films">
      <div className="center-content">
        <div className="film-item" style={{ cursor: "pointer", position: "relative" }}>
          <Button variant="outline-primary" onClick={handlePrev} style={{ position: "absolute", top: "60%", left: "-42px", transform: "translateY(-50%)", width: "41px", background: "transparent", color: "whitesmoke", cursor: "pointer" }}>
            {"<"}
          </Button>
          <Link to={`/details/${extractFilmId(currentFilm._links.self.href)}`}>
            <img src={currentFilm.photo} alt={currentFilm.titre} style={{ width: "300px", height: "auto", marginTop: "99px", borderRadius: "4px" }} />
          </Link>
          <Button variant="outline-primary" onClick={handleNext} style={{ position: "absolute", top: "60%", right: "-42px", transform: "translateY(-50%)", width: "41px", background: "transparent", color: "whitesmoke", cursor: "pointer" }}>
            {">"}
          </Button>
        </div>
      </div>
      <div>
        <div className="movie-container">
          <div>
            <Link to="/all-films">
              <h3 style={{ float: "right", color: "peru" }}>see all</h3>
            </Link>
            <h2 className="release">Nouvelle Edition :</h2>
            <div className="movie-list">
              {films.map((film, index) => (
                <Link key={film.id} to={`/details/${extractFilmId(film._links.self.href)}`} className="movie-item" onClick={() => setCurrentFilmIndex(index)}>
                  <div className="movie-details">
                    <img src={film.photo} alt={film.titre} className="movie-poster" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="new-movies">
            <h1>Nouveautés Films</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

function extractFilmId(url) {
  const parts = url.split("/");
  return parts[parts.length - 1];
}

export default ListeFilms;
