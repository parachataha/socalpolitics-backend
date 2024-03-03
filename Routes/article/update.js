const express = require('express')
const router = express.Router()

// ... (other imports)

module.exports = function (app, db) {

    router.post('/update', (req, res) => {

        let id = req.body.id;
        let title = req.body.title;
        let author = req.body.author;
        let date = req.body.date;
        let tag = req.body.tag;
        let label = req.body.label;
        let location = req.body.location;
        let img = req.body.img;
        let imgDesc = req.body.imgDesc;
        let body = req.body.body;

        if (req.session.userID) {
            console.log('logged in')
            let cols = [req.session.userID];

            db.query('SELECT * FROM users WHERE id = ? LIMIT 1', cols, (err, data, fields) => {

                if (err) {
                    console.error('Error in user SELECT query:', err);
                    res.status(500).json({
                        success: false,
                        msg: 'Internal server error'
                    });
                    return;
                }

                if (data && data.length === 1 && data[0].admin) {
                    let cols = [title, author, date, tag, label, location, img, imgDesc, body]
                    db.query('UPDATE articles SET title=?, author=?, date=?, tag=?, label=?, location=?, img=?, imgDesc=?, body=?, edited=1 WHERE id=?', [...cols, id], (err, result) => {

                        if (err) {
                            res.status(500).json({
                                success: false,
                                msg: 'There was an error updating the article',
                                error: err
                            });
                            return;
                        } else {
                            if (result.affectedRows > 0) {
                                res.json({
                                    success: true,
                                    msg: 'Updated!'
                                })
                                let msg = `Article updated`
                                db.query('INSERT into logs (type, category, affected, msg, user, time) VALUES (?, ?, ?, ?, ?, ?)', ['UPDATE', 'Article', req.body.id, msg, req.session.userID, new Date()], (err, result)=>{
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
                                    msg: 'No rows affected by the update query'
                                });
                                return false;
                            }
                        }
                    });

                } else {
                    res.json({
                        success: false,
                        msg: 'Not authenticated/ not an admin',
                    })
                    return;
                }

            })
        } else {
            res.json({
                success: false,
                msg: 'User not logged in'
            })
            return;
        }

    })

    return router;
}
