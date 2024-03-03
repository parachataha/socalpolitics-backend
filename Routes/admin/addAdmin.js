const express = require('express')
const router = express.Router()

module.exports = function(app, db) {

    router.post('/admin/add', (req, res) => {

        if (req.session.userID) {
            let cols = [req.session.userID];

            db.query('SELECT * FROM users WHERE id = ? LIMIT 1', cols, (err, data, fields) => {

                if (data && data.length === 1) {

                    if (data[0].admin) {
                        db.query('SELECT username FROM users WHERE username = ?', [req.body.username], (err, data, fields) => { 
                            if (err) {
                                res.json({
                                    success: false,
                                    msg: 'An error occurred',
                                    error: err
                                })
                                return;
                            } 
                            if (data && data.length === 1) {
                                db.query('UPDATE users SET admin = 1 WHERE username = ?', [req.body.username], (err, result) => {
                                    if (err) {
                                        res.json({
                                            success: false,
                                            msg: 'An error occurred',
                                            error: err
                                        })
                                        return;
                                    } 
                                    if (result.affectedRows > 0) {
                                        res.json({
                                            success: true,
                                            msg: 'Admin added'
                                        })
                                        res.status(200)
                                        let msg = `Admin added`
                                        db.query('INSERT into logs (type, category, affected, msg, user, time) VALUES (?, ?, ?, ?, ?, ?)', ['ADMIN GRANTED', 'User', req.body.username , msg, req.session.userID, new Date()], (err, result)=>{
                                            if (err) {
                                                console.log(err)
                                            }
                                        })
                                        return true;
                                    } else {
                                        res.status(500)
                                        res.json({
                                            success: false,
                                            msg: 'No rows effected'
                                        })
                                    }
                                })
                            } else {
                                res.json({
                                    success:false,
                                    msg: 'User does not exist'
                                })
                                return;
                            }

                        })
                    }
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
