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
- NOTE: This was developed in a windows environment. If uisng nodemon and it is giving issues on a unix based system, the "start" script may need to change in the package.JSON file to the following: 

>"scripts": {
>  "start": "./node_modules/.bin/nodemon -L express_server.js",
>  "test": "echo \"Error: no test specified\" && exit 1"
>}

## Bug Fixes and Features to Work on

- Create a separate file for databases for best practises.
- Make pages look nicer. Currently the formatting is off on some pages. With more time, this will be improved.
- Set a time limit for cookie expiration for logged in users.
- Login and Registration page need more formatting and links to other pages
- Header could be applied on every page
- Bug if network is restarted and cookies not cleared. Must add condition if network starts again and cookies don't match any users in database, then to clear them autmatically. However, databases are normally stored separately along with some key corresponding information so this bug may not be be that common for practical uses.
