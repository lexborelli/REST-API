'use strict'; 

const auth = require('basic-auth');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

//middleware to authenticate that request using basic auth
exports.authenticateUser = async (req, res, next) => {
    let message; //store the message to display
   
    //parse the user's credentials from the Autorization header 
    const credentials = auth(req);

    if (credentials) {
        const user = await User.findOne({ where: {username: credentials.name} });
        if (user) {
            const authenticated = bcrypt
            .compareSync(credentials.pass, user.confirmedPassword);
         if (authenticated) {
            //if passwords match
            console.log(`Authentication successful for username: ${user.username} `);
            req.currentUser = user;
            } else {
                message = `Authentication failure for username: ${user.username}`
            } 
        } else {
            message = `User not found for username: ${credentials.name}`;
        }
    } else {
        message = 'Auth header not found'; 
    }

    if (message) {
        console.warn(message); 
        res.status(401).json({ message: 'Access Denied' });
    } else {
        next();
    }

};