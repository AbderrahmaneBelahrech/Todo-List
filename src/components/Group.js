import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "./MyTasks.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faSpinner, faCheck } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Group = () => {
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

  return (
    <div className="app-container">
      <Sidebar />
      <ToastContainer position="top-center" reverseOrder={false} />
      <div className="container py-5" style={{ marginLeft: "23%" }}>
        <h4 className="text-center mb-4">Group Tasks</h4>
        <button
          className="btn btn-primary mb-4"
          onClick={() => setShowForm(true)}
        >
          +
        </button>
        {showForm && (
          <div className="overlay" onClick={() => setShowForm(false)}>
            <div className="modal" style={{ display: "block" }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title"></h5>
                  </div>
                  <form
                    // onSubmit={handleAddTask}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="modal-body">
                      <div className="form-group">
                        <label htmlFor="taskName">Task Code:</label>
                        <input
                          type="text"
                          className="form-control"
                          id="taskName"
                          value={newTask}
                          onChange={(e) => setNewTask(e.target.value)}
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
            // onDragOver={(e) => handleDragOver(e)}
            // onDrop={(e) => handleDrop(e, "TO_DO")}
          >
            <h5>ToDo</h5>
            {tasks
              .filter((task) => task.status === "TO_DO")
              .map((task) => (
                <div
                  key={task.id}
                  className="card mb-3"
                  draggable
                  // onDragStart={(e) => handleDragStart(e, task.id)}
                ></div>
              ))}
          </div>
          <div
            className="col-md-4"
            // onDragOver={(e) => handleDragOver(e)}
            // onDrop={(e) => handleDrop(e, "IN_PROGRESS")}
          >
            <h5>Doing</h5>
            {tasks
              .filter((task) => task.status === "IN_PROGRESS")
              .map((task) => (
                <div
                  key={task.id}
                  className="card mb-3"
                  draggable
                  // onDragStart={(e) => handleDragStart(e, task.id)}onDragOver={(e) => handleDragOver(e)}onDrop={(e) => handleDrop(e, "DONE")}onDragStart={(e) => handleDragStart(e, task.id)}
                ></div>
              ))}
          </div>
          <div className="col-md-4">
            <h5>Done</h5>
            {tasks
              .filter((task) => task.status === "DONE")
              .map((task) => (
                <div key={task.id} className="card mb-3" draggable></div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Group;
