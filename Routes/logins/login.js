const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

module.exports = function(app, db) {
    router.post('/login', (req, res) => {
        let username = req.body.username;
        let password = req.body.password;
        username = username.toLowerCase();

        if (username.length > 12 || password.length < 5 || password.length > 30 || username.includes(' ') || password.includes(' ')) {
            res.json({
                success: false, 
                // msg: 'Inputted data does not match requirements.'
                msg: 'An error occurred.'
            })
            return;
        }

        let cols = [username];
        db.query('SELECT * FROM users WHERE username = ? LIMIT 1', cols, (err, data, fields) => {
            if (err) {
                res.json({
                    success: false,
                    msg: 'An error occurred.'
                })
                return;
            } 
            
            // 1 user found w that username
            if (data && data.length === 1) {
                bcrypt.compare(password, data[0].password, (bcryptErr, verified)=> {
                    if(verified) {
                        req.session.save()
                        req.session.userID = data[0].id;

                        res.json({
                            success: true,
                            username: data[0].username,
                            isAdmin: data[0].admin,
                            msg: 'Successfully logged in!'
                        })
                        return;
                    } else {
                        res.json({
                            success: false,
                            msg: 'Incorrect password.',
                        })
                    }
                })
            } else {
                res.json({
                    success: false,
                    msg: 'User not found.'
                })
            }
        })

    })

    return router;
}