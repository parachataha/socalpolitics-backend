const express = require('express')
const router = express.Router()

module.exports = function(app, db) {

    router.get('/search/:query', (req, res) => {
        let query = `${req.params.query}`
    
        if (true) {
            db.query("SELECT * FROM articles WHERE (title LIKE CONCAT('%', ?, '%') AND public = 1) OR (body LIKE CONCAT('%', ?, '%') AND public = 1)", [query, query], (err, data, fields) => {
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
                        msg: 'Articles sent over'
                    });
                    return true
                } else {
                    res.json({
                        success: false,
                        msg: 'Not found',
                        data: []
                    });
                    return;
                }
            });
        } else {
            res.json({
                success: false,
                data: []
            });
            return;
        }
    });
    

    return router;
}
