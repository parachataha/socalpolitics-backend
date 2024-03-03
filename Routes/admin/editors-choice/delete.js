const express = require('express')
const router = express.Router()

module.exports = function(app, db) {

    router.post('/admin/editors-choice/delete', (req, res) => {

        if (req.session.userID) {
            let cols = [req.session.userID];

            db.query('SELECT * FROM users WHERE id = ? LIMIT 1', cols, (err, data, fields) => {

                if (data && data.length === 1) {

                    if (data[0].admin) {
                        db.query('SELECT * FROM articles WHERE id = ? AND public = 1 AND editorsChoice = 1', [req.body.id], (err, data, fields) => { 
                            if (err) {
                                res.json({
                                    success: false,
                                    msg: 'An error occurred',
                                    error: err
                                })
                                return;
                            } 
                            if (data && data.length === 1) {
                                db.query('UPDATE articles SET editorsChoice = 0 WHERE id = ? AND PUBLIC = 1', [req.body.id], (err, result) => {
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
                                            msg: 'Editors Choice Updated'
                                        })
                                        res.status(200)
                                        let msg = `Editors Choice Removed`
                                        db.query('INSERT into logs (type, category, affected, msg, user, time) VALUES (?, ?, ?, ?, ?, ?)', ['EDITORS REMOVE', 'Article', req.body.id , msg, req.session.userID, new Date()], (err, result)=>{
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
                                    msg: 'Article does not exist/ is private/ is not an editors choice'
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
