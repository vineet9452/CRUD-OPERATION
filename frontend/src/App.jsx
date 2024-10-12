import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState(0);
  const [id, setId] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);


  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:5000/employees");
      const employees = await response.json();
      console.log(employees);
      setData(employees);
    } catch (err) {
      console.log("Error fetching employees:", err);
    }
  };

  const handleEdit = (employee) => {
    console.log(employee);
    setIsUpdate(true);
    setId(employee._id);
    console.log(employee._id);
    setFirstName(employee.firstName);
    setLastName(employee.lastName);
    setAge(employee.age);
  };

  const handleDelete = async (id) => {
    console.log(id);
    if (window.confirm("Are you sure you want to delete this item?")) {
      await fetch(`http://localhost:5000/employees/${id}`, {
        method: "DELETE"
      });
      setData(data.filter((item) => item._id !== id));
      console.log(data);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !age) {
      setError("All fields are required");
      return;
    }
    if (isNaN(age) || age <= 0) {
      setError("Please enter a valid age");
      return;
    }

    const employeeData = {
       firstName,
       lastName,
        age
       };
       
    if (isUpdate) {
      console.log(id);
      await fetch(`http://localhost:5000/employees/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData)
      });
      setData(
        data.map((item) =>
          item._id === id ? { ...item, ...employeeData } : item
        )
      );
    } else {
      const response = await fetch("http://localhost:5000/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData)
      });
      const savedEmployee = await response.json();
      console.log(savedEmployee);
      setData([...data, savedEmployee]);
    }
    handleClear();
  };

  const handleClear = () => {
    setId(null);
    setFirstName("");
    setLastName("");
    setAge(0);
    setIsUpdate(false);
    setError("");
  };

  return (
    <div className="App">
      <div
        style={{ display: "flex", justifyContent: "center", margin: "10px 0" }}
      >
        <div>
          <label>
            First Name:
            <input
              type="text"
              placeholder="Enter First Name"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
            />
          </label>
        </div>
        <div>
          <label>
            Last Name:
            <input
              type="text"
              placeholder="Enter Last Name"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
            />
          </label>
        </div>
        <div>
          <label>
            Age:
            <input
              type="number"
              placeholder="Enter Age"
              onChange={(e) => setAge(e.target.value)}
              value={age}
            />
          </label>
        </div>
        <div>
          <button className="btn btn-primary" onClick={handleSave}>
            {isUpdate ? "Update" : "Save"}
          </button>
          <button className="btn btn-danger" onClick={handleClear}>
            Clear
          </button>
        </div>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table className="table table-hover">
        <thead>
          <tr>
            <td>Sr.No</td>
            <td>ID</td>
            <td>First Name</td>
            <td>Last Name</td>
            <td>Age</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item._id}>
              <td>{index + 1}</td>
              <td>{item._id}</td>
              <td>{item.firstName}</td>
              <td>{item.lastName}</td>
              <td>{item.age}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
