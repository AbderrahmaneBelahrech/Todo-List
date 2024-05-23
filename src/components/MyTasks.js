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
  const [userBelongsToGroup, setUserBelongsToGroup] = useState(false);
  const [priority, setPriority] = useState("LOW");
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
  const [Form, setForm] = useState(false);
  const [status, setStatus] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetchTasks();
    fetchGroups();
  }, []);
  useEffect(() => {
    const checkUserGroup = () => {
      if (groups.length > 0) {
        const userGroupExist = groups.some((group) => group.isUserGroup);
        setUserBelongsToGroup(userGroupExist);
      }
    };

    checkUserGroup();
  }, [groups]);

  const fetchGroups = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/user-groups/user/${userId}`
      );
      const userGroups = response.data;

      const allGroupsResponse = await axios.get(
        `http://localhost:8080/api/user-groups`
      );
      const allGroups = allGroupsResponse.data;

      const updatedGroups = allGroups.map((group) => ({
        ...group,
        isLoading: false,
        isUserGroup: userGroups.some((userGroup) => userGroup.id === group.id),
      }));

      setGroups(updatedGroups);
    } catch (error) {
      toast.error("Failed to fetch groups.");
    }
  };

  const fetchTasks = async () => {
    try {
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

      const allTasks = [...userTasks, ...groupTasks];
      setTasks(allTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleShowMenu = (taskId) => {
    if (selectedTaskId === taskId) {
      setShowMenu(!showMenu);
    } else {
      setSelectedTaskId(taskId);
      setShowMenu(true);
    }
  };
  const handleUpdate = async (taskId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/tasks/${taskId}`
      );
      const taskToUpdate = response.data;

      if (taskToUpdate.owner.id === parseInt(userId)) {
        setNewTask(taskToUpdate.name);
        setDescription(taskToUpdate.description);
        setDueDate(taskToUpdate.dueDate);
        setStatus(taskToUpdate.status);
        setTaskId(taskId);
        setForm(true);
        setShowMenu(false);
      } else {
        toast.error("You are not authorized to update this task.");
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
      toast.error("Failed to fetch task details. Please try again.");
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) {
      toast.error("Please enter a task name.");
      return;
    }
    if (description.length >= 150) {
      toast.error("Description must be less than 300 characters.");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:8080/api/tasks/update/${taskId}`,
        {
          name: newTask.trim(),
          description,
          dueDate,
          status,
        }
      );
      const updatedTask = response.data;
      setTasks(tasks.map((task) => (task.id === taskId ? updatedTask : task)));
      setNewTask("");
      setDescription("");
      setDueDate("");
      setForm(false);
      setError(null);
      toast.success("Task updated successfully");
      fetchTasks();
      fetchGroups();
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update the task. Please try again later.");
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) {
      toast.error("Please enter a task name.");
      return;
    }
    if (description.length >= 300) {
      toast.error("Description must be less than 300 characters.");
      return;
    }
    try {
      const taskData = {
        name: newTask.trim(),
        description,
        dueDate,
        status: "TO_DO",
        priority: priority,
        owner: {
          id: userId,
        },
      };

      if (groupName !== "" && groupName !== "default") {
        const selectedGroup = groups.find((group) => group.name === groupName);
        if (selectedGroup) {
          taskData.userGroup = {
            id: selectedGroup.id,
          };
        }
      }

      const response = await axios.post(
        `http://localhost:8080/api/tasks`,
        taskData
      );
      const addedTask = response.data;
      setTasks([...tasks, addedTask]);
      setNewTask("");
      setDescription("");
      setDueDate("");
      setShowForm(false);
      setError(null);
      toast.success("New Task Added successfully");
      fetchTasks();
      fetchGroups();
    } catch (error) {
      toast.error("Failed to add the task. Please try again later.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const isAdmin = groups.find(
        (group) =>
          group.id === tasks.find((task) => task.id === taskId)?.userGroup?.id
      )?.isAdmin;
      if (isAdmin) {
        await axios.delete(`http://localhost:8080/api/tasks/${taskId}`);
        setTasks(tasks.filter((task) => task.id !== taskId));
        toast.success("Task deleted successfully");
        fetchTasks();
        fetchGroups();
      } else {
        toast.error("You are not authorized to delete this task.");
      }
      setShowMenu(false);
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete the task. Please try again later.");
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
      } else {
        toast.info("Task moved to TO_DO");
      }
      fetchTasks();
      fetchGroups();
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

        {Form && (
          <div className="overlay" onClick={() => setForm(false)}>
            <div className="modal" style={{ display: "block" }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Update Task</h5>
                  </div>
                  <form
                    onSubmit={handleUpdateTask}
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
                        Update Task
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setForm(false)}
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
                      <div className="form-group">
                        <label htmlFor="priority">Priority:</label>
                        <select
                          className="form-control"
                          id="priority"
                          value={priority}
                          onChange={(e) => setPriority(e.target.value)}
                        >
                          <option value="LOW">Low</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HIGH">High</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="groupName">Group:</label>
                        {userBelongsToGroup && (
                          <select
                            className="form-control"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            required
                          >
                            <option value="default">Select a group</option>
                            {groups
                              .filter((group) => group.isUserGroup)
                              .map((group) => (
                                <option key={group.id} value={group.name}>
                                  {group.name}
                                </option>
                              ))}
                          </select>
                        )}
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
              .filter(
                (task, index, self) =>
                  index === self.findIndex((t) => t.id === task.id)
              )
              .filter((task) => task.status === "TO_DO")
              .map((task) => (
                <div
                  key={task.id}
                  className="card mb-3"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  style={{
                    backgroundColor: task.userGroup ? "bisque" : "white",
                    borderLeftWidth: "7px",
                    borderLeftColor: (() => {
                      switch (task.priority) {
                        case "LOW":
                          return "blue";
                        case "MEDIUM":
                          return "orange";
                        case "HIGH":
                          return "red";
                      }
                    })(),
                  }}
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
                    </div>
                    <p className="card-text">
                      <span style={{ fontWeight: "bold" }}>
                        {task.userGroup ? "Group name : " : ""}
                      </span>
                      {task.userGroup ? (
                        <span style={{ color: "#0d6efd", fontWeight: "bold" }}>
                          {task.userGroup.name}
                        </span>
                      ) : (
                        ""
                      )}
                    </p>
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
                  <div>
                    <span
                      style={{
                        "margin-left": "4%",
                        "font-weight": "bold",
                        color: (() => {
                          switch (task.priority) {
                            case "LOW":
                              return "blue";
                            case "MEDIUM":
                              return "orange";
                            case "HIGH":
                              return "red";
                          }
                        })(),
                      }}
                    >
                      {task.priority}
                    </span>
                    <span style={{ float: "right" }}>{task.dueDate}</span>
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

              .filter(
                (task, index, self) =>
                  index === self.findIndex((t) => t.id === task.id)
              )
              .filter((task) => task.status === "IN_PROGRESS")
              .map((task) => (
                <div
                  key={task.id}
                  className="card mb-3"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  style={{
                    backgroundColor: task.userGroup ? "bisque" : "white",
                    borderLeftWidth: "7px",
                    borderLeftColor: (() => {
                      switch (task.priority) {
                        case "LOW":
                          return "blue";
                        case "MEDIUM":
                          return "orange";
                        case "HIGH":
                          return "red";
                      }
                    })(),
                  }}
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
                    </div>
                    <p className="card-text">
                      <span style={{ fontWeight: "bold" }}>
                        {task.userGroup ? "Group name : " : ""}
                      </span>
                      {task.userGroup ? (
                        <span style={{ color: "#0d6efd", fontWeight: "bold" }}>
                          {task.userGroup.name}
                        </span>
                      ) : (
                        ""
                      )}
                    </p>
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
                  <div>
                    <span
                      style={{
                        "margin-left": "4%",
                        "font-weight": "bold",
                        color: (() => {
                          switch (task.priority) {
                            case "LOW":
                              return "blue";
                            case "MEDIUM":
                              return "orange";
                            case "HIGH":
                              return "red";
                          }
                        })(),
                      }}
                    >
                      {task.priority}
                    </span>
                    <span style={{ float: "right" }}>{task.dueDate}</span>
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

              .filter(
                (task, index, self) =>
                  index === self.findIndex((t) => t.id === task.id)
              )
              .filter((task) => task.status === "DONE")
              .map((task) => (
                <div
                  key={task.id}
                  className="card mb-3"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  style={{
                    backgroundColor: task.userGroup ? "bisque" : "white",
                    borderLeftWidth: "7px",
                    borderLeftColor: (() => {
                      switch (task.priority) {
                        case "LOW":
                          return "blue";
                        case "MEDIUM":
                          return "orange";
                        case "HIGH":
                          return "red";
                      }
                    })(),
                  }}
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
                    ></div>
                    <p className="card-text">
                      <span style={{ fontWeight: "bold" }}>
                        {task.userGroup ? "Group name : " : ""}
                      </span>
                      {task.userGroup ? (
                        <span style={{ color: "#0d6efd", fontWeight: "bold" }}>
                          {task.userGroup.name}
                        </span>
                      ) : (
                        ""
                      )}
                    </p>
                    <div className="btn-group">
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <span
                      style={{
                        "margin-left": "4%",
                        "font-weight": "bold",
                        color: (() => {
                          switch (task.priority) {
                            case "LOW":
                              return "blue";
                            case "MEDIUM":
                              return "orange";
                            case "HIGH":
                              return "red";
                          }
                        })(),
                      }}
                    >
                      {task.priority}
                    </span>
                    <span style={{ float: "right" }}>{task.dueDate}</span>
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
