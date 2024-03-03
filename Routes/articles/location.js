const express = require('express')
const router = express.Router()

module.exports = function(app, db) {

    router.get('/location/:location', (req, res) => {
        let location = req.params.location
    
        if (location.length > 1) {
            db.query('SELECT * FROM articles WHERE location = ? AND public = 1', [location], (err, data, fields) => {
                if (err) {
                    res.json({
                        success: false,
                        msg: 'An error occurred',
                        error: err,
                        data: []
                    });
                    return;
                }

                if (data) {
                    res.json({
                        success: true,
                        data: data,
                        msg: 'Articles sent over'
                    });
                    return true
                } else {
                    res.json({
                        success: false,
                        msg: 'Not found',
                        data: []
                    });
                    return
                }
            });
        } else {
            res.json({
                success: false,
                data: []
            });
            return
        }
    });
    

    return router;
}
