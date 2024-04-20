import React, { useState } from "react";
import axios from "axios";
import cinemaLogo from "../assets/cinema-logo.png";
import backImage from "../assets/back.jpg";
import { Link } from "react-router-dom";
import "./css/login.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Nom d'utilisateur:", username);
    console.log("Mot de passe:", password);

    axios
      .post("/api/login", { username, password })
      .then((response) => {
        console.log("Réponse du serveur:", response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la requête de connexion:", error);
      });
  };

  return (
    <div>
      <div
        className="backimage"
        style={{
          backgroundImage: `url(${backImage})`,
          "background-size": "cover",
        }}
      >
        <div className="overlay">
          <form onSubmit={handleSubmit}>
            <img src={cinemaLogo} className="headerlogo" />
            <div className="field-container">
              <h3>Nom d'utilisateur</h3>
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={handleUsernameChange}
              />
            </div>
            <div className="field-container">
              <h3>Mot de passe</h3>
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <button type="submit">Se connecter</button>
            <div className="form-link">
              <span>
                Vous n'avez pas de compte ?{" "}
                <Link className="link signup-link" to="/">
                  S'inscrire
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
