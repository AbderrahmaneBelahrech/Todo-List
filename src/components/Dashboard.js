import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";
import Sidebar from "./Sidebar";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchTasksUser();
  }, []);

  const fetchTasksUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/tasks/user/${userId}`
      );
      const userTasks = response.data.filter(
        (task) => task.owner.id === parseInt(userId)
      );
      setTasks(response.data);
      setTasks(userTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  const filterTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status).length;
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="content">
        <div className="container mt-4">
          <div
            className="row justify-content-center"
            style={{ marginLeft: "11%" }}
          >
            <div
              className="col-md-4"
              style={{
                "margin-left": "292px",
                "margin-bottom": "3%",
                "margin-top": "34px",
              }}
            >
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">To Do</h5>
                  <p className="card-textt">
                    Nombre de tâches : {filterTasksByStatus("TO_DO")}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4" style={{ "margin-left": "279px" }}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">In Progress</h5>
                  <p className="card-textt">
                    Nombre de tâches : {filterTasksByStatus("IN_PROGRESS")}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4" style={{ "margin-left": "4%" }}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Done</h5>
                  <p className="card-textt">
                    Nombre de tâches : {filterTasksByStatus("DONE")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
