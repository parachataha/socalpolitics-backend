const express = require('express')
const router = express.Router()

module.exports = function(app, db) {

    router.get('/article/:articleId', (req, res) => {
        let id = req.params.articleId;
    
        if (id.length > 3) {
            if (req.session.userID) {
                db.query('SELECT id, username, admin FROM users WHERE id = ? LIMIT 1', [req.session.userID], (err, data, fields) => {
                    if (err) {
                        res.json({
                            success: false,
                            msg: 'An error occurred',
                            error: err
                        });
                        return;
                    }
    
                    if (data && data.length === 1) {
                        let isAdmin = data[0].admin;
    
                        let query;
                        let queryValues = [req.params.articleId];
    
                        if (isAdmin == 1 || isAdmin === true) {
                            query = 'SELECT * FROM articles WHERE id = ? LIMIT 1';
                        } else {
                            query = 'SELECT * FROM articles WHERE id = ? AND public = 1 LIMIT 1';
                        }
    
                        db.query(query, queryValues, (err, data, fields) => {
                            if (err) {
                                res.json({
                                    success: false,
                                    msg: 'An error occurred',
                                    error: err
                                });
                                return;
                            }
    
                            if (data && data.length > 0 && data[0].id === id) {
                                res.json({
                                    success: true,
                                    data: data[0],
                                    msg: 'Article sent over'
                                });
                            } else {
                                res.json({
                                    success: false,
                                    msg: 'Not found'
                                });
                            }
                        });
                    } else {
                        db.query('SELECT * FROM articles WHERE id = ? AND public = 1 LIMIT 1', [req.params.articleId], (err, data, fields) => {
                            if (err) {
                                res.json({
                                    success: false,
                                    msg: 'An error occurred',
                                    error: err
                                });
                                return;
                            }
    
                            if (data && data.length > 0 && data[0].id === id) {
                                res.json({
                                    success: true,
                                    data: data[0],
                                    msg: 'Article sent over'
                                });
                            } else {
                                res.json({
                                    success: false,
                                    msg: 'Not found'
                                });
                            }
                        });
                    }
                });
            } else {
                db.query('SELECT * FROM articles WHERE id = ? AND public = 1 LIMIT 1', [req.params.articleId], (err, data, fields) => {
                    if (err) {
                        res.json({
                            success: false,
                            msg: 'An error occurred',
                            error: err
                        });
                        return;
                    }

                    if (data && data.length > 0 && data[0].id === id) {
                        res.json({
                            success: true,
                            data: data[0],
                            msg: 'Article sent over'
                        });
                    } else {
                        res.json({
                            success: false,
                            msg: 'Not found'
                        });
                    }
                });
            }
        } else {
            res.json({
                success: false,
                msg: 'Invalid article ID',
            });
        }
    });
    

    return router;
}
