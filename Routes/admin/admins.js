const express = require('express')
const router = express.Router()

module.exports = function(app, db) {

    router.get('/admin/admins', (req, res) => {

        if (req.session.userID) {
            let cols = [req.session.userID];

            db.query('SELECT * FROM users WHERE id = ? LIMIT 1', cols, (err, data, fields) => {

                if (data && data.length === 1) {

                    if (data[0].admin) {
                        db.query('SELECT id,username,admin FROM users WHERE admin = 1 ORDER BY id', (err, data, fields) => {
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
                                    msg: 'Admins sent over'
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
