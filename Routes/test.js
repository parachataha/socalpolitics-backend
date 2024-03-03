const express = require('express')
const router = express.Router()

module.exports = function(app, db) {

    router.get('/', (req, res) => {
    
        res.json({
            message: 'Hello world!'
        })
        console.log('Hello world!')

    });
    

    return router;
}
