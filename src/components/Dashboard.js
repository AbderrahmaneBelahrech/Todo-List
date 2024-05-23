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
<<<<<<< HEAD
      const userTasksResponse = await axios.get(
        `http://localhost:8080/api/tasks/user/${userId}`
      );
      const userTasks = userTasksResponse.data.filter(
        (task) => task.owner.id === parseInt(userId)
      );

      const groupTasksResponse = await axios.get(
        `http://localhost:8080/api/tasks/group/user/${userId}`
      );
      const groupTasks = groupTasksResponse.data;

      const uniqueUserTasks = [];

      userTasks.forEach((task) => {
        if (!uniqueUserTasks.some((uniqueTask) => uniqueTask.id === task.id)) {
          uniqueUserTasks.push(task);
        }
      });

      const uniqueGroupTasks = groupTasks.filter(
        (groupTask) =>
          !uniqueUserTasks.some((userTask) => userTask.id === groupTask.id)
      );

      const uniqueTasks = [...uniqueUserTasks, ...uniqueGroupTasks];

      setTasks(uniqueTasks);

      const userCreatedTasksCount = uniqueUserTasks.length;

      const groupTasksCount = uniqueGroupTasks.length;

      console.log(
        "Nombre de tâches créées par l'utilisateur:",
        userCreatedTasksCount
      );
      console.log(
        "Nombre de tâches des groupes auxquels l'utilisateur appartient:",
        groupTasksCount
      );
=======
      const response = await axios.get(
        `http://localhost:8080/api/tasks/user/${userId}`
      );
      const userTasks = response.data.filter(
        (task) => task.owner.id === parseInt(userId)
      );
      setTasks(response.data);
      setTasks(userTasks);
>>>>>>> ece4238d7e7f499fe0fac257cee4b860eb2e7f15
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
<<<<<<< HEAD

  const countTasksByStatus = (status) => {
=======
  const filterTasksByStatus = (status) => {
>>>>>>> ece4238d7e7f499fe0fac257cee4b860eb2e7f15
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
<<<<<<< HEAD
                    Nombre de tâches : {countTasksByStatus("TO_DO")}
=======
                    Nombre de tâches : {filterTasksByStatus("TO_DO")}
>>>>>>> ece4238d7e7f499fe0fac257cee4b860eb2e7f15
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4" style={{ "margin-left": "279px" }}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">In Progress</h5>
                  <p className="card-textt">
<<<<<<< HEAD
                    Nombre de tâches : {countTasksByStatus("IN_PROGRESS")}
=======
                    Nombre de tâches : {filterTasksByStatus("IN_PROGRESS")}
>>>>>>> ece4238d7e7f499fe0fac257cee4b860eb2e7f15
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4" style={{ "margin-left": "4%" }}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Done</h5>
                  <p className="card-textt">
<<<<<<< HEAD
                    Nombre de tâches : {countTasksByStatus("DONE")}
=======
                    Nombre de tâches : {filterTasksByStatus("DONE")}
>>>>>>> ece4238d7e7f499fe0fac257cee4b860eb2e7f15
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
