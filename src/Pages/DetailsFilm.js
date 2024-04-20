import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./css/DetailsFilm.css";

function DetailsFilm() {
  const { id } = useParams();
  const [filmDetails, setFilmDetails] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const [prix, setPrix] = useState(50);
  const [typePlace, setTypePlace] = useState("standard");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [formValid, setFormValid] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const handleTypePlaceChange = (event) => {
    const selectedType = event.target.value;
    setTypePlace(selectedType);

    if (selectedType === "orchestre") {
      setPrix(50 * 1.2);
    } else if (selectedType === "vip") {
      setPrix(50 * 1.6);
    } else {
      setPrix(50);
    }
  };

  useEffect(() => {
    const fetchFilmDetails = async () => {
      if (!id) {
        console.log("Aucun ID de film fourni.");
        return;
      }

      try {
        const response = await axios.get(`/api/films/${id}`);
        setFilmDetails(response.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des détails du film :",
          error
        );
        setFilmDetails(null);
      }
    };

    fetchFilmDetails();
  }, [id]);

  useEffect(() => {
    const isFormValid =
      nom.trim() !== "" && prenom.trim() !== "" && email.trim() !== "";
    setFormValid(isFormValid);
  }, [nom, prenom, email]);

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
    setButtonClicked(true);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
    setButtonClicked(false);
  };

  const renderFilmDetails = () => {
    if (currentStep === 1 && filmDetails) {
      const {
        titre,
        description,
        date_sortie, // This variable is not used in the code
        realisateur,
        genre,
        duree,
        photo,
      } = filmDetails;
      const formattedDate = new Date(
        filmDetails.dateSortie
      ).toLocaleDateString();

      return (
        <div className="film-details">
          <img src={photo} alt={titre} className="film-image" />
          <div style={{ marginTop: "100px", color: "aliceblue" }}>
            <h1 className="film-details-text title">Titre : {titre}</h1>

            <h5 className="film-details-text details">
              Année de sortie : {formattedDate}
            </h5>
            <h5 className="film-details-text details">
              Réalisateur : {realisateur}
            </h5>
            <h5 className="film-details-text details">Genre : {genre}</h5>
            <h5 className="film-details-text details">
              Durée : {duree} minutes
            </h5>
            <p className="film-details-text description">
              Description : {description}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderForm = () => {
    if (currentStep === 2) {
      return (
        <div className="session-form-container">
          <h2>Détails de la séance</h2>
          <form>
            <label htmlFor="cinema">Cinéma :</label>
            <input type="text" id="cinema" name="cinema" required />

            <label htmlFor="salle">Salle :</label>
            <input type="text" id="salle" name="salle" required />

            <label htmlFor="heure">Heure :</label>
            <input type="text" id="heure" name="heure" required />

            <label htmlFor="placeType">Type de place :</label>
            <select
              id="placeType"
              name="placeType"
              value={typePlace}
              onChange={handleTypePlaceChange}
            >
              <option value="standard">Standard</option>
              <option value="orchestre">Orchestre</option>
              <option value="vip">VIP</option>
            </select>

            <h2 htmlFor="prix">
              Prix : <span>{prix} Dh</span>
            </h2>
          </form>
        </div>
      );
    } else if (currentStep === 3) {
      return (
        <div className="reservation-form-container">
          <h2>Détails de la réservation</h2>
          <form>
            <label htmlFor="nom">Nom :</label>
            <input type="text" id="nom" name="nom" required />
            <label htmlFor="prenom">Prénom :</label>
            <input type="text" id="prenom" name="prenom" required />
            <label htmlFor="email">Email :</label>
            <input type="email" id="email" name="email" required />
          </form>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="film-details-container">
      <div className="progress-container">
        <div className={`step ${currentStep === 1 ? "active" : ""}`}>1</div>
        <div className={`step ${currentStep === 2 ? "active" : ""}`}>2</div>
        <div className={`step ${currentStep === 3 ? "active" : ""}`}>3</div>
      </div>

      {renderFilmDetails()}
      {renderForm()}

      <div className="navigation-buttons">
        <button
          className="btn btn-primary"
          onClick={handlePrevStep}
          disabled={currentStep === 1}
        >
          Previous
        </button>
        <button
          className="btn btn-primary"
          onClick={handleNextStep}
          disabled={!formValid && buttonClicked}
        >
          {currentStep === 3 ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
}

export default DetailsFilm;
