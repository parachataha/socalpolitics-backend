const express = require('express');

const loginRoute = require('./logins/login');
const logoutRoute = require('./logins/logout');
const isLoggedIn = require('./logins/isLoggedIn');
const signup = require('./logins/signup');

const postArticle = require('./article/post');
const getArticle = require('./article/get');
const updateArticle = require('./article/update');

const privateArticle = require('./article/private');
const publicArticle = require('./article/public');

const all = require('./articles/all')
const tag = require('./articles/tag');
const location = require('./articles/location');
const search = require('./articles/search');

const homeMain = require('./articles/home/main');
const homeLocation = require('./articles/home/location');

const editorsChoice = require('./articles/editorsChoice');
const featured = require('./articles/featured')

// admin APIs
const adminArticles = require('./admin/allArticles');
const adminDrafts = require('./admin/drafts');
const adminPublic = require('./admin/public')
const adminAllAdmins = require('./admin/admins');
const adminAddAdmin = require('./admin/addAdmin');
const adminDeleteAdmin = require('./admin/deleteAdmin');
const adminLogs = require('./admin/logs');

// admin editor choice APIs
const adminEditorsChoiceGet = require('./admin/editors-choice/get');
const adminEditorsChoiceAdd = require('./admin/editors-choice/add');
const adminEditorsChoiceDelete = require('./admin/editors-choice/delete');

const adminFeaturedGet = require('./admin/featured/get');
const adminFeaturedAdd = require('./admin/featured/add');
const adminFeaturedDelete = require('./admin/featured/delete');

const cdnAdd = require('./cdn/add');
const test = require('./test');

class Router {

    constructor(app, db) {
        const router = express.Router();

        // admin editors choice 
        router.use('/', adminEditorsChoiceGet(app, db))
        router.use('/', adminEditorsChoiceAdd(app, db))
        router.use('/', adminEditorsChoiceDelete(app, db))

        router.use('/', adminFeaturedGet(app, db))
        router.use('/', adminFeaturedAdd(app, db))
        router.use('/', adminFeaturedDelete(app, db))

        // admin 
        router.use('/', adminAddAdmin(app,db))
        router.use('/', adminArticles(app,db))
        router.use('/', adminDrafts(app, db))
        router.use('/', adminPublic(app, db))
        router.use('/', adminAllAdmins(app,db))
        router.use('/', adminDeleteAdmin(app,db))
        router.use('/', adminLogs(app,db))

        // public and private articles
        router.use('/', privateArticle(app, db))
        router.use('/', publicArticle(app, db))

        // account management
        router.use('/', loginRoute(app, db));
        router.use('/', logoutRoute(app, db));
        router.use('/', isLoggedIn(app, db));
        router.use('/', signup(app, db));
        router.use('/', postArticle(app, db));
        router.use('/', getArticle(app, db));

        router.use('/', updateArticle(app, db))

        router.use('/', tag(app, db));
        router.use('/', location(app, db));
        router.use('/', all(app, db));
        router.use('/', search(app, db));

        // home
        router.use('/', homeMain(app, db));
        router.use('/', homeLocation(app, db));

        router.use('/', editorsChoice(app, db));
        router.use('/', featured(app, db));

        router.use('/', cdnAdd(app, db));

        router.use('/', test(app, db));
        app.use('/api', router);
    }

}

module.exports = Router;