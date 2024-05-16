import React from "react";
import { Route, Routes } from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import MyTasks from "./components/MyTasks";
import Group from "./components/Group";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <>
      <ToastContainer />
      <div className="App">
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/tasks" element={<MyTasks />} />
          <Route path="/group" element={<Group />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
