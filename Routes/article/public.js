const express = require('express')
const router = express.Router()

module.exports = function(app, db) {

    router.post('/admin/public', (req, res) => {

        if (req.session.userID) {
            let cols = [req.session.userID];

            db.query('SELECT * FROM users WHERE id = ? LIMIT 1', cols, (err, data, fields) => {

                if (data && data.length === 1) {

                    if (data[0].admin) {
                        db.query('UPDATE articles SET public = 1 WHERE id = ?', [req.body.id], (err, result) => {
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
                                    msg: 'Article is now public'
                                })
                                let msg = `Article made public`
                                db.query('INSERT into logs (type, category, affected, msg, user, time) VALUES (?, ?, ?, ?, ?, ?)', ['MADE PUBLIC', 'Article', req.body.id, msg, req.session.userID, new Date()], (err, result)=>{
                                    if (err) {
                                        console.log(err)
                                    }
                                    if (result.affectedRows === 1) {
                                        return;
                                    }
                                })
                                return true;
                            } else {
                                res.json({
                                    success: false,
                                    msg: 'An error occurred',
                                })
                                return;
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
