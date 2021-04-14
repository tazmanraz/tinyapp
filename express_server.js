const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");

// Generates random 6 character string
const generateRandomString = function() {
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < 6; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


const createNewUser = (id, email, password) => {
  if (userDatabase[id]) {
    return { error: "User already exists", data: null }
  }

  if (!email || !password) {
    return { error: "There is an empty field", data: null }
  }

  userDatabase[id] = { id, email, password }
  return { error: null, data: { id, email, password } }
}

// Local object database for short and corresponding long urls
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//stores users
const userDatabase = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}


// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

///////////////////////
// --- ALL app.pos/////
///////////////////////

// logs in, sets cookie, and redirects to /urls
app.post('/login', (req, res) => {
  let username = req.body['username'];
  res.cookie('user_id', userDatabase[req.cookies['user_id']]['email'])
  res.redirect("/urls/");
});

// logs out, clears cookie, and redirects to /urls
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls/');
});

//register
app.post('/register', (req, res) => {
  const { email, password } = req.body;
  let user_id = generateRandomString();
  
  const result = createNewUser(user_id, email, password)

  if (result.error) {
    return res.send(result.error)
  }

  res.cookie("user_id", user_id)
  console.log(userDatabase)
  res.redirect("/urls/");
});


// Generates a random short URL and goes to a confirmation page on the redirect
app.post("/urls", (req, res) => {
  let inputSite = req.body.longURL;
  let shortString = generateRandomString();
  urlDatabase[shortString] = inputSite;
  console.log(urlDatabase)
  res.redirect("/urls/"+shortString)
});

// Deletes the url from our database
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls/");
});

// Updates the url from our database
app.post('/urls/:shortURL', (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.newLink
  res.redirect('/urls/')
});


///////////////////////
// --- ALL app.get/////
///////////////////////

// Renders a list of the urls
app.get("/urls", (req, res) => {
  console.log(userDatabase[req.cookies['user_id']]['email'])
  const templateVars = { urls: urlDatabase, user: userDatabase[req.cookies['user_id']]['email'] };
  res.render("urls_index", templateVars);
});

// Renders the new urls page where users can make a new URL
app.get("/urls/new", (req, res) => {
  res.render("urls_new", { user: userDatabase[req.cookies['user_id']]['email'] });
});

// Confirmation page that shows short and long URL
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: userDatabase[req.cookies['user_id']]['email'] };
  res.render("urls_show", templateVars);
});

// Goes to the long url page if we put in our shortUrl under /u/:shortURL
app.get("/u/:shortURL", (req, res) => {
  let shortKey = req.params.shortURL;
  const longURL = urlDatabase[shortKey];
  res.redirect(longURL);
});

// Confirmation page that shows short and long URL
app.get("/register", (req, res) => {
  const templateVars = { };
  res.render("register", templateVars);
});



//--------------------------
// Connecting to server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});