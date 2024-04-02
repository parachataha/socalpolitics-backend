## Welcome to Socal-Politics-backend
This repo used to be the backend source code for [SoCal Politics API](https://api.socalpolitics.com). Which is now shut down. 
<br/> </br>
It was a news website dedicated to providing nonpartisan stories on Southern California USA news. 
<br/> </br>
The backend for the website was coded by @parachataha on Github (me) and was coded with Express.JS, (node.js) and mysql, (mysql-session), (express-session). The backend consists of an authentication system with by a mySQL table for users and user sessions and consists of a CDN system to upload user files to the website's file system. The backend also has admin-locked API endpoints to upload new articles, delete, publish (make public), save as draft and more.
<br/> </br>
_The main app is called `app.js`. This is because cPanel/WHM's `application manager` runs `app.js` by default. You may change this however the app may not be run on cPanel if configuration settings are not changed._

_The app composes of an Express server connected to a mySQL database on IP address `162.0.214.122`; remote access disabled. The app is run on [https://api.socalpolitics.com](https://api.socalpolitics.com). This app accesses `/public_html/cdn/images/` to use the API for the CDN._
<br/>
By Taha Paracha
