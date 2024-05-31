'use strict';

//load modules 
const express = require('express');

const { User, Course } = require('./models');
const { authenticateUser } = require('./middleware/auth-user');
const { asyncHandler } = require('./middleware/async-handler');

const bcrypt = require('bcrypt');
const router = express.Router();

///api/users - GET: This will return all properties and values for the currently authenticated User along with a 200 HTTP status code.
router.get('/users', (req, res) => {
    // Get the user from the request body.
    res.status(200).json(users);
    
});

//POST route creates a new user account
router.post('/users', (req, res) => {
    //Get the user from the request body
    const user = req.body;
    //store errors
    const errors = [];
    
    //Validate that we have a `name` value
    
    if (!user.name) {
            errors.push('Please provide a value for a "name"');
        }
     //validate that we have an `email` value 
    if (!user.email) {
        errors.push('Please provide a value for "email"');
    } 
    //validate that we have `password` value
    if (!user.password) {
        errors.push('Please provide a value for "password"');
    } else {
        user.password = bcrypt.hashSync(user.password, 10);
    }

    //if there are any errors
    if (errors.length > 0) {
        //return the validation errors to the client
        res.status(400).json({ errors });
    } else {
        // add the user to the `users` array
        users.push(user);

        // set the status to 201 created and end the response.
        res.status(201).end();  
    }
}); 