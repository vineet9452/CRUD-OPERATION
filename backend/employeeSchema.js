const mongoose = require('./DbConnection') 

const employeeSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    age: Number
  });

  const Employee = mongoose.model('Employee', employeeSchema);
  module.exports = Employee