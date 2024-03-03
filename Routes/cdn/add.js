const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require("node:fs");
const multer = require("multer");
const upload = multer({ dest: "../public_html/cdn/tmp" });
const router = express.Router();

const dirPath = "../public_html/cdn/";

/**
 * Takes in the request from the api and checks if the user is an admin.
 * `callback` is the callback function that takes in an error and a boolean that
 * represents if the user was an admin or not.
 * @param {Array<String>} id - User id.
 * @param {mysql.Connection} db - Database connection.
 * @param {(err, isAdmin: Boolean) => {}} callback - Callback.
 */
function isAdmin(id, db, callback) {
    const query = "SELECT * FROM users WHERE id = ? LIMIT 1";
    db.query(query, id, (err, data, _) => {
        if (err)
            return callback(err, false);

        if (data && data.length === 1 && data[0].admin)
            return callback(null, true);
    });
    return callback(null, false);
}

/**
 * Creates a directory in the /public_html/cdn/images/ path. The name of the
 * directory will be the article id. Returns null if it was able to create
 * a directory, otherwise returns an error. 
 * @param {String} articleID - Article id.
 * @returns {err}
 */
function createArticleCDN(articleID) {
    const path = dirPath + articleID;
    try {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
            return null;
        }
    } catch (err) {
        return err;
    }
}

module.exports = (app, db) => {
    router.post('/cdn/add', upload.single("image"), (req, res) => {
        if (!req.session.userID) {
            res.json({
                success: false,
            });
        }

        isAdmin([ req.session.userID ], db, (err, admin) => {
            if (!admin)
                return;
        
            const file = req.files;
            const image = req.body.imageData;
            const articleID = req.body.articleID;
            const validationQuery = "SELECT * FROM articles WHERE id = ? LIMIT 1";

            if (!image) {
                res.json({
                    success: false,
                    msg: "No image to upload."
                });
                return;
            }

            db.query(validationQuery, [articleID], (err, data, _) => {
                if (err) {
                    res.json({
                        success: false,
                        msg: "Failed to look up article in database."
                    });
                    return;
                }

                if (data.length === 0) {
                    res.json({
                        success: false,
                        msg: "Couldn't find article in database."
                    });
                    return;
                }

                let createErr = createArticleCDN(articleID)
                if (createErr) {
                    res.json({
                        success: false,
                        msg: createErr
                    });
                    return;
                }

                res.json({
                    success: true,
                    msg: "Successfully uploaded image to the tmp dir."
                });
            })

        });

    })

    return router;
}