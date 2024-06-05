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
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
   // Get the user from the request body.
    const user = req.currentUser;
    if (!user) {
        return res.status(404).json({ message: 'User cannot be found' });

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
//the application should include validation to ensure that the following required values are properly submitted in the request body: firstName, lastName, emailAddress, password
//If any of these required values are not properly submitted, the application should respond by sending a 400 HTTP status code and validation errors.

router.post('/users', asyncHandler(async (req, res) => {
    try {
       await User.create(req.body);
     // set the status to 201 created and end the response.
        res.status(201).location('/').end();  
    
    } catch (error) {
    //If any of these required values are not properly submitted, the application should respond by sending a 400 HTTP status code and validation errors.
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        console.log('Error: ' + errors);
        res.status(400).json({ errors });
    } else {
        throw error;
     }
    }
})); 
    
    


//api/courses-Get route for courses, Return all courses including the User object associated with each course and a 200 HTTP status code.
router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll(
        {include : [
            {
                Model: User,
                as: 'user',
            },
        ],
    });
    res.status(200).json(courses);
}));

//api/courses/:-GET: Return the corresponding course including the User object associated with that course and a 200 HTTP status code.
router.get('/courses/:id', asyncHandler(async (req, res) => {
    
    const course = await Course.findByPk(req.params.id, 
        {include: [
            {
            Model: User,
            as: 'user',
            }
        ]
    });
    res.status(200).json(course);
}));

//api/courses - POST: Create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content.
//the application should include validation to ensure that the following required values are properly submitted in the request body: title, description
//If any of these required values are not properly submitted, the application should respond by sending a 400 HTTP status code and validation errors.
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const course =  await Course.create(req.body);
        //set the Location header to "/", and return a 201 HTTP status code and no content.
        res.status(201).location(`/courses/${course.id}`).end();
    } catch(error) {
        console.log('Error: ', error.name);
    //If any of these required values are not properly submitted, the application should respond by sending a 400 HTTP status code and validation errors.
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });
    } else {
        throw error;
       }
    }
    }));

//api/courses/:id - PUT: Update the corresponding course and return a 204 HTTP status code and no content.
// the application should include validation to ensure that the following required values are properly submitted in the request body: title, description
//If any of these required values are not properly submitted, the application should respond by sending a 400 HTTP status code and validation errors.
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    
    try {
      const course = await Course.findByPk(req.params.id);
     if (course) {
      if (course.userId === req.currentUser.id) {
        await course.update(req.body);
        res.status(204).end();
      } else {
        res.status(403).json({ message: 'You are not an authorized user' });
      }
    } else {
        res.status(404).json({message: 'Course was not found'});
      }
    
    } catch(error) {
    //If any of these required values are not properly submitted, the application should respond by sending a 400 HTTP status code and validation errors.
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });
    } else {
        throw error;
       }
    }
}));


//api/courses/:id - DELETE: Delete the corresponding course and return a 204 HTTP status code and no content.
router.delete('/courses/:id', authenticateUser, asyncHandler(async(req, res) => {
    try {
        const course = await Course.findByPk(req.params.id); 
        if (course) {
            if (course.userId === req.currentUser.id) {
            await course.destroy(); 
            res.status(204).end();
        } else {
            res.status(403).json({message: "Quote not found"});
        }
     }
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

module.exports = router; 

