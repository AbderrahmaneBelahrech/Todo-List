import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
// import cinemaLogo from "./assets/cinema-logo.png";
import "./App.css";
import { Link, Route, Routes } from "react-router-dom";
import ListeFilms from "./Pages/ListeFilms";
import DetailsFilm from "./Pages/DetailsFilm";
// import LoginPage from "./Pages/LoginPage";
import AjouterCinema from "./Pages/AjouterCinema";
import AjouterFilm from "./Pages/AjouterFilm";
import Admin from "./Pages/Admin";
// import BasicTable from "./Pages/test"
import SignUp from "./components/SignUp"
// import { Login } from "@mui/icons-material";
import Login from "./components/Login"
import ListSignUp from "./components/ListSignUp";
import bt from './components/bt.1';


function App() {
  return (
    // <div className="App">
    <div className="">
      {/* <header className="header">
        <img src={cinemaLogo} alt="Logo" className="logo" />
        <div className="buttons">
          <Link to="/">Accueil</Link>
          <Link to="/films">Films</Link>
          <Link className="button" to="/login">
            Se connecter
          </Link>
        </div>
      </header> */}

      <Routes>
        <Route path="/" element={<ListeFilms />} />
        {/* <Route path="/bt" element={<bt/>} /> */}
        {/* <Route path="/bt" element={<bt/>} /> */}
        {/* <Route path="/log" element={<ListeFilms />} /> */}
        <Route path="/ss" element={<ListSignUp />} />
        <Route path="/sign-up" element={<SignUp/>} />
        <Route path="/login" element={<Login/>} />
        {/* <Route path="/login" element={<LoginPage />} /> */}
        <Route path="/ajouter-cinema" element={<AjouterCinema />} />
        <Route path="/ajouter-film" element={<AjouterFilm />} />
        <Route path="/details/:id" element={<DetailsFilm />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;
