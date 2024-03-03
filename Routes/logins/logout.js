const express = require('express');
const router = express.Router();

module.exports = function(app, db) {

    router.post('/logout', (req, res) => {

        if (req.session.userID) {

            req.session.destroy()
            res.json({
                success: true
            })
            return true;

        } else {

            res.json({
                success: false
            })
            return false;
            
        }

    });

    return router;
}