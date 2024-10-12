const express = require("express");
const Employee = require("./employeeSchema");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/employees", async (req, res) => {
  const employees = await Employee.find();
  res.send(employees);
});

app.post("/employees", async (req, res) => {
  console.log("-->", req.body);
  const { firstName, lastName, age } = req.body;
  const newEmployee = new Employee({
    firstName,
    lastName,
    age
  });
  const savedEmployee = await newEmployee.save();
  res.send(savedEmployee);
});


app.put("/employees/:id", async (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, age } = req.body;
  console.log(firstName, lastName, age);
  const updatedEmployee = await Employee.updateOne(
    { _id: id },
    {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age
      }
    }
  );
  res.send(updatedEmployee);
});


app.delete("/employees/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const deletedEmployee = await Employee.deleteOne({ _id: id });
  res.send(deletedEmployee);
});


const PORT = 5000;
app.listen(PORT, () =>{ 
  console.log(`Server is running on port ${PORT}`)
});
