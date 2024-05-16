import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "./MyTasks.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faSpinner, faCheck } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyTasks = () => {
  const userId = localStorage.getItem("userId");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/tasks/user/${userId}`
      );
      const userTasks = response.data.filter(
        (task) => task.owner.id === parseInt(userId)
      );
      setTasks(userTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleShowMenu = (taskId) => {
    if (selectedTaskId === taskId) {
      setShowMenu(!showMenu); // Inverser l'état du menu
    } else {
      setSelectedTaskId(taskId); // Mettre à jour l'ID de la tâche sélectionnée
      setShowMenu(true); // Afficher le menu
    }
  };

  const generateRandomCode = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const length = 8; // Longueur du code
    let code = "";
    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

  const handleUpdate = async (taskId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/tasks/${taskId}`
      );
      const taskToUpdate = response.data;
      // Mettre à jour le formulaire avec les informations de la tâche sélectionnée
      setNewTask(taskToUpdate.name);
      setDescription(taskToUpdate.description);
      setDueDate(taskToUpdate.dueDate);
      setTaskId(taskId);
      setShowForm(true); // Afficher le formulaire de création de tâche avec les informations pré-remplies
    } catch (error) {
      console.error("Error fetching task details:", error);
      toast.error("Failed to fetch task details. Please try again.");
    }
  };

  const handleShare = () => {
    const randomCode = generateRandomCode();
    console.log("Random code:", randomCode);
    console.log("button clicked ");
    // Affichez le code généré ou envoyez-le à votre ami ici
    // Vous pouvez également implémenter une logique pour envoyer le code au backend
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) {
      toast.error("Please enter a task name.");
      return;
    }
    if (description.length >= 150) {
      toast.error("Description must be less than 300 characters .");
      return;
    }
    try {
      const response = await axios.post(`http://localhost:8080/api/tasks`, {
        name: newTask.trim(),
        description,
        dueDate,
        status: "TO_DO",
        owner: {
          id: userId,
        },
      });
      const addedTask = response.data;
      setTasks([...tasks, addedTask]);
      setNewTask("");
      setDescription("");
      setDueDate("");
      setShowForm(false);
      setError(null);
      toast.success("New Task Added successfully");
    } catch (error) {
      toast.error("Failed to add the task. Please try again later.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:8080/api/tasks/delete/${taskId}`);
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
      toast.info("Task Deleted ");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task. Please try again.");
    }
  };

  const moveTask = async (taskId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/tasks/update/${taskId}/status?status=${newStatus}`
      );
      const updatedTask = response.data;
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? updatedTask : task
      );
      setTasks(updatedTasks);
      if (newStatus === "IN_PROGRESS") {
        toast.info("Task moved to IN_PROGRESS");
      } else if (newStatus === "DONE") {
        toast.success("Task moved to DONE");
      }
      window.location.reload();
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status. Please try again.");
    }
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, newStatus) => {
    const taskId = e.dataTransfer.getData("taskId");
    moveTask(taskId, newStatus);
  };

  return (
    <div className="app-container">
      <Sidebar />
      <ToastContainer position="top-center" reverseOrder={false} />
      <div className="container py-5" style={{ marginLeft: "23%" }}>
        <h4 className="text-center mb-4">My Tasks</h4>
        <button
          className="btn btn-primary mb-4"
          onClick={() => setShowForm(true)}
        >
          New Task
        </button>
        {showForm && (
          <div className="overlay" onClick={() => setShowForm(false)}>
            <div className="modal" style={{ display: "block" }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">New Task</h5>
                  </div>
                  <form
                    onSubmit={handleAddTask}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="modal-body">
                      <div className="form-group">
                        <label htmlFor="taskName">Task Name:</label>
                        <input
                          type="text"
                          className="form-control"
                          id="taskName"
                          value={newTask}
                          onChange={(e) => setNewTask(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="taskDescription">Description:</label>
                        <textarea
                          className="form-control"
                          id="taskDescription"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        ></textarea>
                      </div>
                      <div className="form-group">
                        <label htmlFor="dueDate">Due Date:</label>
                        <input
                          type="date"
                          className="form-control"
                          id="dueDate"
                          min={new Date().toISOString().split("T")[0]}
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="submit" className="btn btn-primary">
                        Add Task
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="row">
          <div
            className="col-md-4"
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDrop(e, "TO_DO")}
          >
            <h5>ToDo</h5>
            {tasks
              .filter((task) => task.status === "TO_DO")
              .map((task) => (
                <div
                  key={task.id}
                  className="card mb-3"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-end">
                      <button
                        className="btn btn-link"
                        onClick={() => handleShowMenu(task.id)}
                      >
                        <svg
                          width="40px"
                          height="20px"
                          viewBox="-3.68 -3.68 23.36 23.36"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="#000000"
                          className="three-dots-vertical"
                        >
                          <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
                        </svg>
                      </button>
                    </div>
                    <h5 className="card-title">{task.name}</h5>
                    <p className="card-text">{task.description}</p>
                    <div
                      className={`dropdown-menu ${
                        selectedTaskId === task.id && showMenu ? "show" : ""
                      }`}
                      ref={menuRef}
                    >
                      <button
                        className="dropdown-item"
                        onClick={() => handleUpdate(task.id)}
                      >
                        Update
                      </button>
                      <button className="dropdown-item" onClick={handleShare}>
                        Share
                      </button>
                    </div>
                    <div className="btn-group">
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => moveTask(task.id, "IN_PROGRESS")}
                      >
                        <FontAwesomeIcon icon={faSpinner} />
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => moveTask(task.id, "DONE")}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div
            className="col-md-4"
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDrop(e, "IN_PROGRESS")}
          >
            <h5>Doing</h5>
            {tasks
              .filter((task) => task.status === "IN_PROGRESS")
              .map((task) => (
                <div
                  key={task.id}
                  className="card mb-3"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-end">
                      <button
                        className="btn btn-link"
                        onClick={() => handleShowMenu(task.id)}
                      >
                        <svg
                          width="40px"
                          height="20px"
                          viewBox="-3.68 -3.68 23.36 23.36"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="#000000"
                          className="three-dots-vertical"
                        >
                          <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
                        </svg>
                      </button>
                    </div>
                    <h5 className="card-title">{task.name}</h5>
                    <p className="card-text">{task.description}</p>
                    <div
                      className={`dropdown-menu ${
                        selectedTaskId === task.id && showMenu ? "show" : ""
                      }`}
                      ref={menuRef}
                    >
                      <button
                        className="dropdown-item"
                        onClick={() => handleUpdate(task.id)}
                      >
                        Update
                      </button>
                      <button className="dropdown-item" onClick={handleShare}>
                        Share
                      </button>
                    </div>
                    <div className="btn-group">
                      <button
                        className="btn btn-secondary"
                        onClick={() => moveTask(task.id, "DONE")}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div
            className="col-md-4"
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDrop(e, "DONE")}
          >
            <h5>Done</h5>
            {tasks
              .filter((task) => task.status === "DONE")
              .map((task) => (
                <div
                  key={task.id}
                  className="card mb-3"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-end">
                      <button
                        className="btn btn-link"
                        onClick={() => handleShowMenu(task.id)}
                      >
                        <svg
                          width="40px"
                          height="20px"
                          viewBox="-3.68 -3.68 23.36 23.36"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="#000000"
                          className="three-dots-vertical"
                        >
                          <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
                        </svg>
                      </button>
                    </div>
                    <h5 className="card-title">{task.name}</h5>
                    <p className="card-text">{task.description}</p>
                    <div
                      className={`dropdown-menu ${
                        selectedTaskId === task.id && showMenu ? "show" : ""
                      }`}
                      ref={menuRef}
                    >
                      <button className="dropdown-item" onClick={handleShare}>
                        Share
                      </button>
                    </div>
                    <div className="btn-group">
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTasks;
