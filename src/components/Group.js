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

  return (
    <div className="app-container">
      <Sidebar />
      <ToastContainer position="top-center" reverseOrder={false} />
      <div className="container py-5" style={{ marginLeft: "23%" }}>
        <h4 className="text-center mb-4">Groups</h4>
        <button
          className="btn btn-primary mb-4"
          onClick={() => setShowForm(true)}
          disabled={groups.length >= 4}
        >
          New Group
        </button>

        {showForm && (
          <div className="overlay" onClick={() => setShowForm(false)}>
            <div className="modal" style={{ display: "block" }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">New Group</h5>
                  </div>
                  <form
                    onSubmit={handleAddGroup}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="modal-body">
                      <div className="form-group">
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
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="submit" className="btn btn-primary">
                        Add Group
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
        </div>
      </div>
    </div>
  );
};

export default Group;
