const express = require('express')
const router = express.Router()

module.exports = function(app, db) {

    router.post('/admin/delete', (req, res) => {

        if (req.session.userID) {
            let cols = [req.session.userID];

            db.query('SELECT * FROM users WHERE id = ? LIMIT 1', cols, (err, data, fields) => {

                if (data && data.length === 1) {

                    if (data[0].admin) {
                        db.query('UPDATE users SET admin = 0 WHERE username = ? AND username != ?', [req.body.username, data[0].username], (err, data, fields) => {
                            if (err) {
                                res.json({
                                    success: false,
                                    msg: 'An error occurred',
                                    error: err
                                })
                                return;
                            }
                            else {
                                res.json({
                                    success: true,
                                    msg: 'Admin deleted'
                                })
                                let msg = `Admin revoked`
                                    db.query('INSERT into logs (type, category, affected, msg, user, time) VALUES (?, ?, ?, ?, ?, ?)', ['ADMIN REVOKED', 'User', req.body.username , msg, req.session.userID, new Date()], (err, result)=>{
                                        if (err) {
                                            console.log(err)
                                        }
                                    })
                                    return true;
                            }
                        })
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
