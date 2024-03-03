const express = require('express')
const router = express.Router()
const genPass = require('../../GenPass')

module.exports = function(app, db) {

    router.post('/signup', (req, res) => {

        let username = req.body.username;
        let password = req.body.password;

        username = username.toLowerCase().trim()

        if (username.length > 12 || password.length < 5 || password.length > 30 || username.includes(' ') || password.includes(' ')) {
            res.json({
                success: false,
                msg: 'Inputted data does not match requirements.'
            })
            return;
        } else {

            let cols = [username]
            db.query('SELECT * FROM users WHERE username = ? LIMIT 1', cols, (err, data, fields) => {

                if (err) {
                    // Handle the database error
                    console.error(err);
                    res.json({
                        success: false,
                        msg: 'Signup failed. Please try again later.'
                    });
                    return;
                }

                if (data.length !== 0) {
                    // user already exists
                    res.json({
                        success: false,
                        msg: 'Signup failed. Check your details again.'
                    });
                } else {

                    let insertCols = [username, genPass(password)]
                    db.query('INSERT INTO users(username, password) VALUES(?, ?)', insertCols, (err, data, fields) => {

                        if (err) {
                            // Handle the database error
                            console.error(err);
                            res.json({
                                success: false,
                                msg: 'Signup failed. Please try again later.'
                            });
                        } else {
                            // Assuming 'insertId' is the auto-incremented ID of the newly inserted user
                            req.session.userID = data.insertId;

                            res.json({
                                success: true,
                                username: username,
                                msg: 'Signup successful.'
                            });
                             
                        }

                    })
                }
            });
        }
    })

    return router;
}
