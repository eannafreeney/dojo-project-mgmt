import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { timestamp } from "../../firebase/config";

// hooks
import { useCollection } from "../../hooks/useCollection";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";

// styles
import "./create.css";

const categories = [
  { value: "development", label: "Development" },
  { value: "design", label: "Design" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
];

export default function Create() {
  const { user } = useAuthContext();
  const { addDocumentToFirestore, response } = useFirestore("projects");
  const navigate = useNavigate();

  const { documents } = useCollection("users");
  const [users, setUsers] = useState([]);

  // form field values
  const [projectName, setProjectName] = useState("");
  const [details, setDetails] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [assignedUsers, setAssignedUsers] = useState([]);
  // const [formError, setFormError] = useState(null);
  const [categoryError, setCategoryError] = useState(null);
  const [selectError, setSelectError] = useState(null);

  useEffect(() => {
    if (documents) {
      const options = documents.map((user) => {
        return { value: user, label: user.displayName };
      });
      setUsers(options);
    }
  }, [documents]);

  const resetErrors = () => {
    setCategoryError(null);
    setSelectError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetErrors();

    if (!category && !assignedUsers.length < 1) {
      setCategoryError("Please select a category");
      return;
    }
    if (!category) {
      setSelectError("Please assign to at least one user");
      return;
    }
    if (assignedUsers.length < 1) {
      setSelectError("Please assign to at least one user");
      return;
    }

    const createdBy = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      id: user.uid,
    };

    const assignedUsersList = assignedUsers.map((user) => {
      return {
        displayName: user.value.displayName,
        photoURL: user.value.photoURL,
        id: user.value.id,
      };
    });

    const project = {
      name: projectName,
      details: details,
      category: category.value,
      dueDate: timestamp.fromDate(new Date(dueDate)),
      comments: [],
      createdBy,
      assignedUsersList,
    };

    await addDocumentToFirestore(project);
    if (!response.error) {
      navigate("/");
    }
  };

  return (
    <div className="create-form">
      <h2 className="page-title">Create a New Project</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Project Name:</span>
          <input
            type="text"
            required
            onChange={(e) => setProjectName(e.target.value)}
            value={projectName}
          />
        </label>
        <label>
          <span>Project Details:</span>
          <textarea
            required
            onChange={(e) => setDetails(e.target.value)}
            value={details}
            rows="5"
          />
        </label>
        <label>
          <span>Due Date:</span>
          <input
            type="date"
            required
            onChange={(e) => setDueDate(e.target.value)}
            value={dueDate}
          />
        </label>
        <label>
          <span>Project Category:</span>
          <Select
            options={categories}
            onChange={(option) => setCategory(option)}
          />
        </label>
        {categoryError && <div className="error">{categoryError}</div>}
        <label>
          <span>Assign To:</span>
          <Select
            onChange={(option) => setAssignedUsers(option)}
            options={users}
            maxMenuHeight={120}
            isMulti
          />
        </label>
        {selectError && <div className="error">{selectError}</div>}
        {/* {formError && <div className="error">{formError}</div>} */}
        <button className="btn">add Project</button>
      </form>
    </div>
  );
}
