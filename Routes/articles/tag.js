const express = require('express')
const router = express.Router()

module.exports = function(app, db) {

    router.get('/tag/:tag', (req, res) => {
        let tag = req.params.tag
    
        if (tag.length > 1) {
            db.query('SELECT * FROM articles WHERE tag = ? AND public = 1', [tag], (err, data, fields) => {
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
                    return
                }
            });
        } else {
            res.json({
                success: false
            });
            return
        }
    });
    

    return router;
}
