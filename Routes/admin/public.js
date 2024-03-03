const express = require('express')
const router = express.Router()

module.exports = function(app, db) {

    router.get('/admin/public', (req, res) => {

        if (req.session.userID) {
            let cols = [req.session.userID];

            db.query('SELECT * FROM users WHERE id = ? LIMIT 1', cols, (err, data, fields) => {

                if (data && data.length === 1) {
                    req.session.username = data[0].username;
                    req.session.isAdmin = data[0].admin;

                    let userData = {
                        success: true,
                        username: data[0].username,
                        isAdmin: data[0].admin
                    }

                    if (data[0].admin) {
                        db.query('SELECT * FROM articles WHERE public = 1 ORDER BY no DESC', (err, data, fields) => {
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
                                    msg: 'Not found'
                                });
                                return
                            }
                        });
                    }
                    return true;
                } else {
                    res.json({
                        success:false, 
                        msg: 'Not authorized'
                    })
                }

            })
        } else {
            res.json({
                success: false,
                msg: 'Not authorized'
            })
        }
    

    });
    

    return router;
}
