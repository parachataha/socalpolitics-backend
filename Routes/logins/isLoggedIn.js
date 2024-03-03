const express = require('express')
const router = express.Router()

module.exports = function(app, db) {

    router.post('/isLoggedIn', (req, res) => {
        
        if (req.session.userID) {
            let cols = [req.session.userID];

            db.query('SELECT * FROM users WHERE id = ? LIMIT 1', cols, (err, data, fields) => {

                if (data && data.length === 1) {

                    req.session.username = data[0].username;
                    req.session.isAdmin = data[0].admin;

                    res.json({
                        success: true,
                        username: data[0].username,
                        isAdmin: data[0].admin
                    })
                    return true;
                } else {
                    res.json({
                        success:false
                    })
                }

            })
        } else {
            res.json({
                success: false,
                msg: 'error'
            })
        }

    });

    return router;
}