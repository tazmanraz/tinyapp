///////////////////////////////////////////////////
// CONSTANTS, LIBRARIES, MODULES AND MIDDLEWARE ///
///////////////////////////////////////////////////
const { getUserByEmail, generateRandomString, createNewUser, checkLogin, urlsForUser } = require('./helpers');

const PORT = 8080;
const saltRounds = 10;

const bodyParser = require("body-parser");
const express = require("express");
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
}));

app.set("view engine", "ejs");

/////////////////////////////////////
//////////      DATABASES        ////
/////////////////////////////////////

// Database to be moved on separate file on resubmission for best practises
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "vffUkR" },
  cxYzPo: { longURL: "https://www.zombo.com", userID: "userRandomID" },
};

//stores users
const userDatabase = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: bcrypt.hashSync("purple-monkey-dinosaur", saltRounds)
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: bcrypt.hashSync("dishwasher-funk", saltRounds)
  }
}

///////////////////////
// POST REQUESTS  /////
///////////////////////

// Logs in, sets cookie, and redirects to /urls
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const result = checkLogin(email, password, userDatabase);

  if (result.error) {
    return res.status(result.status).send(result.error);
  }

  let user_id = getUserByEmail(email, userDatabase);
  
  req.session['user_id'] = user_id;
  res.redirect("/urls/");
})

// Logs out, clears cookie, and redirects to /urls
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls/');
});

// Registering backend process
app.post('/register', (req, res) => {
  const { email, password } = req.body;
  let user_id = generateRandomString();
  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  const result = createNewUser(user_id, email, hashedPassword, userDatabase)

  if (result.error) {
    return res.status(result.status).send(result.error);
  }
  req.session['user_id'] = result['data']['id'];
  res.redirect("/urls/");
});


// Generates a random short URL and goes to a confirmation page on the redirect
app.post("/urls", (req, res) => {
  let inputSite = req.body.longURL;
  let shortString = generateRandomString();

  if (req.session['user_id']) {
    urlDatabase[shortString] = { longURL: inputSite, userID: req.session['user_id'] }
    res.redirect("/urls/" + shortString);
  } else {
    return res.status(403).send('403 Error. You do not have permission for this');
  }
});

// Deletes the url from our database
app.post('/urls/:shortURL/delete', (req, res) => {
  if (urlDatabase[req.params.shortURL]['userID'] === req.session['user_id']) {
    delete urlDatabase[req.params.shortURL]; 
    res.redirect("/urls/");
  } else {
    return res.status(403).send('403 Error. You do not have permission for this');
  }
});

// Updates the url from our database
app.post('/urls/:shortURL', (req, res) => {
  if (req.session['user_id']) {
    urlDatabase[req.params.shortURL] = { longURL: req.body.newLink, userID: req.session['user_id'] }
    res.redirect('/urls/');
  } else {
    return res.status(403).send('403 Error. You do not have permission for this');
  }
});

///////////////////////
// GET REQUESTS   /////
///////////////////////

// For root of page
app.get("/", (req, res) => {
  if (req.session['user_id']) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

// Renders a list of the urls
app.get("/urls", (req, res) => {
  let formattedDatabase = urlsForUser(req.session['user_id'], urlDatabase);

  if (req.session['user_id']){
    const templateVars = { 
      urls: formattedDatabase, 
      user: userDatabase[req.session['user_id']]['email']  
    };
    res.render("urls_index", templateVars);
  } else {
    return res.status(401).send('401 Error. You are not supposed to be here. Go to /register or /login');
  }
});

// Renders the new urls page where users can make a new URL
app.get("/urls/new", (req, res) => {
  if (req.session['user_id']){
    res.render("urls_new", { user: userDatabase[req.session['user_id']]['email'] });
  } else {
    res.redirect('/login');
  }
});

// Confirmation page that shows short and long URL
app.get("/urls/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    return res.status(404).send('404 Error. This page does not exist');
  }
  
  if (urlDatabase[req.params.shortURL]['userID'] === req.session['user_id']) {
    let formattedDatabase = urlsForUser(req.session['user_id'], urlDatabase);
    const templateVars = { 
      shortURL: req.params.shortURL, 
      longURL: formattedDatabase[req.params.shortURL],  
      user: userDatabase[req.session['user_id']]['email']  
    };
    res.render("urls_show", templateVars);
  } else {
    return res.status(403).send('403 Error. You do not have permission for this');
  }
});

// Goes to the long url page if we put in our shortUrl under /u/:shortURL
app.get("/u/:shortURL", (req, res) => {
  let shortKey = req.params.shortURL;
  if (!urlDatabase[shortKey]) {
    return res.status(404).send('404 Error. This page does not exist');
  } else {
    const longURL = urlDatabase[shortKey]['longURL'];
    res.redirect(longURL);
  }
});

// Registration page
app.get("/register", (req, res) => {
  if (req.session['user_id']){
    res.redirect('/urls');
  }
  res.render("register", {});
});

// Login page
app.get("/login", (req, res) => {
  if (req.session['user_id']){
    res.redirect('/urls');
  }
  res.render("login", {});
});


//////////////////////////
// Connecting to server //
//////////////////////////
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});