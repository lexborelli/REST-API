'use strict';

//load modules 
const express = require('express');

const { User, Course } = require('./models');
const { authenticateUser } = require('./middleware/auth-user');
const { asyncHandler } = require('./middleware/async-handler');

const bcrypt = require('bcrypt');
const { Model } = require('sequelize');
const router = express.Router();

//api/users - GET: 
router.get('/users', asyncHandler(async (req, res) => {
   // Get the user from the request body.
    const user = req.currentUser;
    if (!user) {
        return res.status(400).json({ message: 'User cannot be found' });

    }
    //This will return all properties and values for the currently authenticated User along with a 200 HTTP status code
    res.status(200).json({
        id: user.id,
        firstName: user.firstName, 
        lastName: user.lastName,
        emailAddress: user.emailAddress
    });
    
}));

//api/users- POST route creates a new user account
router.post('/users', asyncHandler(async (req, res) => {
    try {
    const User =  await User.create(req.body);
    //set the Location header to "/", and return a 201 HTTP status code and no content.
    res.status(201).location('/').end();
    } catch(err) {
        res.json({message: err.message});
    }
})); 
    
    //Validate that we have a `name` value
    
    //if (!user.name) {
           // errors.push('Please provide a value for a "name"');
        //}
     //validate that we have an `email` value 
    //if (!user.email) {
        //errors.push('Please provide a value for "email"');
    //} 
    //validate that we have `password` value
    //if (!user.password) {
      //  errors.push('Please provide a value for "password"');
    //} else {
      //  user.password = bcrypt.hashSync(user.password, 10);
    //}

    //if there are any errors
    //if (errors.length > 0) {
        //return the validation errors to the client
      //  res.status(400).json({ errors });
    //} else {
        // add the user to the `users` array
      //  users.push(user);

        // set the status to 201 created and end the response.
        //res.status(201).end();  
    //}


//api/courses-Get route for courses, Return all courses including the User object associated with each course and a 200 HTTP status code.
router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
        include : [
            {
                Model: 'User',
                as: 'user',
            },
        ],
    });
    res.status(200).json(courses);
}));

