Here is the backend code for the app.

The main app is called `app.js`. This is because cPanel/WHM's `application manager` runs `app.js` by default. You may change this however the app may not be run on cPanel if configuration settings are not changed.

The app composes of an Express server connected to a mySQL database on IP address `162.0.214.122`; remote access disabled. The app is run on [https://api.socalpolitics.com](https://api.socalpolitics.com). This app accesses `/public_html/cdn/images/` to use the API for the CDN.

By Taha Paracha
