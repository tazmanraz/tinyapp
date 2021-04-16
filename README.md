# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["Screenshot of URLs page"](https://github.com/tazmanraz/tinyapp/blob/master/docs/urls-page.PNG)
!["Screenshot of create page"](https://github.com/tazmanraz/tinyapp/blob/master/docs/create.PNG)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
- NOTE: This was developed in a windows environment. If using nodemon on a unix based system, the "start" script has to change in package.JSON: 

>"scripts": {
>  "start": "./node_modules/.bin/nodemon -L express_server.js",
>  "test": "echo \"Error: no test specified\" && exit 1"
>}

## Bug Fixes and Features to Work on

- Move all helper functions to helper.js. Currently having referencing issues and will have to use closures to fix this.
- Some conditionals could be optimized. Particularly checkLogin.
- Create a separate file for databases for best practises.
- Make pages look nicer. Currently the formatting is off on some pages. With more time, this will be improved.
- Set a time limit for cookie expiration for logged in users.
- Login and Registration page need more formatting and links to other pages
- Header could be applied on every page
- Bug with if network is restarted and cookies not cleared. Must add condition if network starts again and cookies don't match any users in database, then to clear them autmatically.