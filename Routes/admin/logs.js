const express = require('express')
const router = express.Router()

module.exports = function(app, db) {

// SELECT l.id,l.type,l.affected,l.article,l.msg, u.username AS admin,l.time
// FROM logs l 
// INNER JOIN users u ON l.user = u.id 

    router.get('/admin/logs', (req, res) => {

        if (req.session.userID) {
            let cols = [req.session.userID];

            db.query('SELECT * FROM users WHERE id = ? LIMIT 1', cols, (err, data, fields) => {

                if (data && data.length === 1) {

                    if (data[0].admin) {
                        db.query('SELECT l.id,l.type,l.category,l.affected,l.msg, u.username AS username,l.time FROM logs l INNER JOIN users u ON l.user = u.id ORDER BY l.id DESC LIMIT 100', (err, data, fields) => {
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
