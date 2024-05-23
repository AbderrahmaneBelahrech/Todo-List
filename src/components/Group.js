<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";

const Group = () => {
  const [showForm, setShowForm] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupMembersEmails, setGroupMembersEmails] = useState("");
  const [groups, setGroups] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/user-groups/user/${userId}`
      );
      const updatedGroups = response.data.map((group) => ({
        ...group,
        isLoading: false,
      }));
      setGroups(updatedGroups);
    } catch (error) {
      toast.error("Failed to fetch groups.");
    }
  };

  const handleAddGroup = async (event) => {
    event.preventDefault();
    const emails = groupMembersEmails.split(",").map((email) => email.trim());

    if (emails.length > 4) {
      toast.error("A group can only have up to 4 members.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/api/user-groups?userId=${userId}`,
        {
          name: groupName,
          userEmails: emails,
          createdById: userId,
        }
      );
      if (response.status === 201) {
        toast.success("Group added successfully!");
        setShowForm(false);
        setGroupName("");
        setGroupMembersEmails("");
        fetchGroups();
      } else {
        toast.error("Failed to add group.");
      }
    } catch (error) {
      toast.error("An error occurred while adding the group.");
    }
  };
=======
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
>>>>>>> ece4238d7e7f499fe0fac257cee4b860eb2e7f15

  return (
    <div className="app-container">
      <Sidebar />
      <ToastContainer position="top-center" reverseOrder={false} />
      <div className="container py-5" style={{ marginLeft: "23%" }}>
<<<<<<< HEAD
        <h4 className="text-center mb-4">Groups</h4>
        <button
          className="btn btn-primary mb-4"
          onClick={() => setShowForm(true)}
          disabled={groups.length >= 4}
        >
          New Group
        </button>

=======
        <h4 className="text-center mb-4">Group Tasks</h4>
        <button
          className="btn btn-primary mb-4"
          onClick={() => setShowForm(true)}
        >
          +
        </button>
>>>>>>> ece4238d7e7f499fe0fac257cee4b860eb2e7f15
        {showForm && (
          <div className="overlay" onClick={() => setShowForm(false)}>
            <div className="modal" style={{ display: "block" }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
<<<<<<< HEAD
                    <h5 className="modal-title">New Group</h5>
                  </div>
                  <form
                    onSubmit={handleAddGroup}
=======
                    <h5 className="modal-title"></h5>
                  </div>
                  <form
                    // onSubmit={handleAddTask}
>>>>>>> ece4238d7e7f499fe0fac257cee4b860eb2e7f15
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="modal-body">
                      <div className="form-group">
<<<<<<< HEAD
                        <label htmlFor="groupName">Group Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="groupName"
                          value={groupName}
                          onChange={(e) => setGroupName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="modal-body">
                      <div className="form-group">
                        <label htmlFor="groupEmails">
                          Group Members Emails
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="groupEmails"
                          placeholder="Emails separated with comma"
                          value={groupMembersEmails}
                          onChange={(e) =>
                            setGroupMembersEmails(e.target.value)
                          }
                          required
=======
                        <label htmlFor="taskName">Task Code:</label>
                        <input
                          type="text"
                          className="form-control"
                          id="taskName"
                          value={newTask}
                          onChange={(e) => setNewTask(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
>>>>>>> ece4238d7e7f499fe0fac257cee4b860eb2e7f15
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="submit" className="btn btn-primary">
<<<<<<< HEAD
                        Add Group
=======
                        Add Task
>>>>>>> ece4238d7e7f499fe0fac257cee4b860eb2e7f15
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
<<<<<<< HEAD

        <div className="row">
          {groups.length > 0 ? (
            groups.map((group) => (
              <div key={group.id} className="col-md-4 mb-4">
                <div className="card">
                  <FontAwesomeIcon
                    icon={faUsers}
                    style={{
                      textAlign: "center",
                      fontSize: "x-large",
                      marginTop: "2vh",
                    }}
                  />
                  <div className="card-body" style={{ height: "174px" }}>
                    <h5 className="card-title">{group.name}</h5>
                    <p className="card-text">
                      Members:{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {group.isLoading ? "Loading..." : group.users.length}
                      </span>
                      <br />
                      {group.isLoading
                        ? "Loading..."
                        : group.users.map((user, index) => (
                            <span
                              key={user.id}
                              style={{
                                color:
                                  user.email === group.createdBy.email
                                    ? "red"
                                    : "black",
                              }}
                            >
                              {user.email}
                              {user.email === group.createdBy.email
                                ? " ( Admin )"
                                : ""}
                              {index < group.users.length - 1 ? <br /> : ""}
                            </span>
                          ))}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No groups available.</p>
          )}
=======
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
>>>>>>> ece4238d7e7f499fe0fac257cee4b860eb2e7f15
        </div>
      </div>
    </div>
  );
};

export default Group;
