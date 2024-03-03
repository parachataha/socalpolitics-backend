const express = require('express')
const router = express.Router()

module.exports = function(app, db) {

    router.get('/articles', (req, res) => {
    
        db.query('SELECT * FROM articles WHERE public = 1 ORDER BY no', (err, data, fields) => {
                if (err) {
                    res.json({
                        success: false,
                        msg: 'An error occurred',
                        error: err,
                        data: []
                    });
                    return;
                }

                if (data && data.length > 0) {
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
    });
    

    return router;
}
