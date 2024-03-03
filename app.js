const http = require('http');
const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cors = require('cors');
const Router = require('./Routes/index');

const hostname = process.env.HOSTNAME;
const port = process.env.PORT; 

const app = express();
const server = http.createServer(app);

const corsOptions = {
    origin: ['https://162.0.214.122', 'https://socalpolitics.com', 'https://api.socalpolitics.com'],
    credentials: true
};
app.use(cors(corsOptions));

// Set up MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements: false
});

db.connect((err)=>{
    if (err) {
        console.log('error!', err);
        throw err;
        return false;
    }
    else {
        console.log('Corrected successfully')
    }
});

const sessionStore = new MySQLStore({
    ttl: 1825 * 86400,
    endConnectionOnClose: false
}, db);

app.use(session({
    key: process.env.KEY, 
    secret: process.env.SECRET,
    store: sessionStore, 
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: (1825 * 86400 * 1000),
        httpOnly: false,
        sameSite: 'lax'
    }
}));

app.use(express.json());

// Initialize routes
new Router(app, db);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
