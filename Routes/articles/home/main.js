const express = require('express')
const router = express.Router()

module.exports = function(app, db) {

    router.get('/home/main', (req, res) => {
    
        db.query('SELECT * FROM articles WHERE public = 1 ORDER BY no DESC LIMIT 19', (err, data, fields) => {
                if (err) {
                    res.json({
                        success: false,
                        msg: 'An error occurred',
                        error: err
                    });
                    return;
                }

                if (data && data.length > 0) {
                    res.json({
                        success: true,
                        data: data,
                        msg: '3,8 Articles sent over'
                    });
                    return true
                } else {
                    res.json({
                        success: false,
                        msg: 'Not found'
                    });
                    return
                }
        });
    });
    

    return router;
}
