const mongoose = require('mongoose');

// Define the schema for the Employee model
const employeeSchema = new mongoose.Schema({
    fullName: { type: String },
    email: { type: String , unique: true },
    mobileNo: { type: Number },
    gender: { type: String },
    course: { type: Array }, 
    designation: { type: String },
    date: { type: Date, default: Date.now }, 
    photo: { type: String }
});



// Create a model based on the schema
const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
