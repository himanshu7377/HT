const express = require('express');

const multer = require("multer");
const path = require("path");

const Employee = require('../model/employe');

const route = express.Router();


// Mock user database
const users = [
  { id: 1, userName: 'admin', password: '123' }
];


//  checkDuplicateEmail middleware

const checkDuplicateEmail = async (req, res, next) => {
    try {
      const existingEmployee = await Employee.findOne({ email: req.body.email });
      if (existingEmployee) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      next();
    } catch (error) {
      console.error('Error checking duplicate email:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  




const GetDate=()=>{
    const date = new Date();
  
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  

  let currentDate = `${day}/${month}/${year}`;
  return currentDate
  }


  // login endpoint
route.post('/login', (req, res) => {
    const { userName, password } = req.body;
    console.log(userName, password)
    const user = users.find(u => u.userName === userName && u.password === password);
  
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    console.log(user)
    res.status(200).json({ message: 'user login successfully', user });
  });
  

// Storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './Public/EmpImage/'); // Upload files to the 'EmpImage' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage });

// Fetch all employees
route.get("/employees", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//  Fetch single employee
route.get("/singleemployees/:id", async (req, res) => {
    try {
        const id=req.params.id
      const singleEmployee = await Employee.find({ _id: id });
      res.json(singleEmployee);
    } catch (error) {
      console.error('Error fetching single employees:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Create employee
route.post('/createemployees',checkDuplicateEmail, upload.single('photo'), async (req, res) => {
  try {
    const formData = req.body;
    const photoFile = req.file;

    let employee = await Employee.create({
      fullName: formData.fullName,
      email: formData.email,
      mobileNo: formData.mobileNo,
      gender: formData.gender,
      course: formData.course,
      designation: formData.designation,
      date: GetDate(),
      photo: photoFile.filename
    });

    await employee.save();
    res.status(200).json({ message: 'Employee created successfully' });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.email) {
      // If the error is due to duplicate email, send a 400 Bad Request response with the error message
      res.status(300).json({ error: 'Email already exists' });
    } else {
      console.error('Error creating employee:', error);
      res.status(500).json({ error: 'Internal Server Error from here' });
    }
  }
});

// Update employee
route.put('/updateemployee', checkDuplicateEmail,upload.single('photo'), async (req, res) => {
  try {
    const formData = req.body;
    const photoFile = req.file;
   
    if (photoFile) {
        var myquery = { email: formData.email };
        var newvalues = { $set: { fullName: formData.fullName, email: formData.email, mobileNo: formData.mobileNo, gender: formData.gender, course: formData.course, designation: formData.designation, photo: photoFile.filename } };
        const r = await Employee.updateOne(myquery, newvalues);
      }
      var myquery = { email: formData.email };
      var newvalues = { $set: { fullName: formData.fullName, email: formData.email, mobileNo: formData.mobileNo, gender: formData.gender, course: formData.course, designation: formData.designation } };

    await Employee.updateOne(myquery, newvalues);
    res.status(200).json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete employee
route.delete('/employee/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    const deletedItem = await Employee.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = route;