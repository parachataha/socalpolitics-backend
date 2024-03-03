const express = require('express')
const router = express.Router()

module.exports = function(app, db) {

    router.post('/article', (req, res) => {

        
        if (req.session.userID) {

            let cols = [req.session.userID];

            db.query('SELECT * FROM users WHERE id = ? LIMIT 1', cols, (err, data, fields) => {

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
                let visibility = req.body.visibility;
        
                let creator = data[0].username;
                let createdAt = new Date().toISOString().slice(0, 10)
                let creatorIsAdmin = data[0].admin;

                if (data && data.length === 1 && data[0].admin) {
                    if (!id.length > 4 && !title?.length > 1 && !author?.length > 1 && !tag?.length > 1 && !label?.length > 1 && !location?.length > 1 && !img?.length > 1 && !imgDesc?.length > 1 && !body?.length > 13) {
                        res.json({
                            success: false,
                            msg: 'Inputted data does not match requirements.'
                        })
                        return;
                    } else {
            
                        let cols = [id, title, author, date, tag, label, location, img, imgDesc, body, creator, createdAt, creatorIsAdmin, visibility]
                        db.query('INSERT INTO articles (id, title, author, date, tag, label, location, img, imgDesc, body, creator, createdAt, creatorIsAdmin, public) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', cols, (err, result) => {
        
                            if (err) {
                                res.json({
                                    success: false,
                                    msg: 'There was an error',
                                    error: err
                                });
                                return;
                            } else {
                                res.json({
                                    success: true,
                                    msg: 'Posted!'
                                })
                                
                                let msg = `Created new article`
                                db.query('INSERT into logs (type, category, affected, msg, user, time) VALUES (?, ?, ?, ?, ?, ?)', ['POST', 'Article', req.body.id, msg, req.session.userID, new Date()], (err, result)=>{
                                    if (err) {
                                        console.log(err)
                                    }
                                    if (result.affectedRows === 1) {
                                        return;
                                    }
                                })
                                return true;
                            }
                        });
                    }
                } else {
                    res.json({
                        success:false,
                        msg: 'Not authenticated/ logged in',
                    })
                }

            })
        } else {
            res.json({
                success: false
            })
        }

    })

    return router;
}
