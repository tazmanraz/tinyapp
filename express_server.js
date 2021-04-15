const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");

////////////////////////
///----HELPER FUNCTIONS
////////////////////////


// Generates random 6 character string
const generateRandomString = function() {
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < 6; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// function to check if email exists
const checkEmail = function(input) {
  for (const id in userDatabase) {
    if (userDatabase[id]['email'] === input) {
      return id; // this is a truthy statement - change if giving issues
    } 
  }
  return null;
}

// function to create a new user
const createNewUser = (id, email, password) => {
  if (!email || !password) {
    return { status: 400, error: "There is an empty field", data: null }
  }

  if (checkEmail(email)) {
    return { status: 400, error: "User already exists", data: null } 
  }

  userDatabase[id] = { id, email, password }
  return { status: null, error: null, data: { id, email, password } }
}

// Checks login credentials
const checkLogin = (email, password) => {
  let id = checkEmail(email);
  if (!id) {
    return { status: 403, error: "Error logging in (no email)", data: null }
  }
  if (id) {
    if (userDatabase[id]['password'] !== password) {
      return { status: 403, error: "Error logging in (password)", data: null }
    }
  }
  return { status: null, error: null, data: { email, password } }
}

// checks if user is logged in from cookies
// const isUserLoggedIn = (checkCookies) => {
//   let result = "";
//   if ('undefined' !== typeof checkCookies) {
//     result = userDatabase[checkCookies]['email'];
//   }
//   return result;
// }


// Function for filtering urls based on user_id
const urlsForUser = (id) => {
  let userUrlDatabase = {}
  for (const key in urlDatabase) {
    if (id === urlDatabase[key]['userID']){
      userUrlDatabase[key] = urlDatabase[key]['longURL'];
    }
  }
  return userUrlDatabase;
}


/////////////////////////////////////
////////// -----  DATABASES -----
/////////////////////////////////////

// Local object database for short and corresponding long urls
// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "vffUkR" },
  cxYzPo: { longURL: "https://www.youtube.com", userID: "aJ48lW" },
};

//stores users
const userDatabase = { 
  "aJ48lW": {
    id: "aJ48lW", 
    email: "user@example.com", 
    password: "asdf"
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
// --- ALL app.post/////
///////////////////////

// logs in, sets cookie, and redirects to /urls
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const result = checkLogin(email, password)

  if (result.error) {
    return res.status(result.status).send(result.error)
  }

  //let user_id = checkLogin(result.data['email'])
  let emailOfId = result.data['email'];
  let user_id = checkEmail(emailOfId);
  
  res.cookie("user_id", user_id);
  console.log(user_id)
  res.redirect("/urls/");
})

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
    return res.status(result.status).send(result.error)
  }

  res.cookie("user_id", user_id)
  //console.log(userDatabase)
  res.redirect("/urls/");
});


// Generates a random short URL and goes to a confirmation page on the redirect
app.post("/urls", (req, res) => {
  let inputSite = req.body.longURL;
  let shortString = generateRandomString();
  
  //urlDatabase[shortString] = inputSite; // HAVE TO REVISE AND ADD USER ID
  //let userVal = isUserLoggedIn(req.cookies['user_id']);
  //console.log("short string generated:" + shortString)
  if (req.cookies['user_id']) {
    urlDatabase[shortString] = { longURL: inputSite, userID: req.cookies['user_id'] }
    res.redirect("/urls/" + shortString);
  } else {
    res.redirect('/login')
  }
  //urlDatabase[shortString] = { longURL: inputSite, userID: checkEmail(userVal) }
})

// Deletes the url from our database
app.post('/urls/:shortURL/delete', (req, res) => {
  
  if (urlDatabase[req.params.shortURL]['userID'] === req.cookies['user_id']) {
    delete urlDatabase[req.params.shortURL]; // SHOULD BE SAME
    res.redirect("/urls/");
  } else {
    res.redirect("/urls/");
  }

});

// Updates the url from our database
app.post('/urls/:shortURL', (req, res) => {

  //urlDatabase[req.params.shortURL] = req.body.newLink; // HAVE TO UPDATE AND INCLUDE USER ID
  //let userVal = isUserLoggedIn(req.cookies['user_id']);

  if (req.cookies['user_id']) {
    urlDatabase[req.params.shortURL] = { longURL: req.body.newLink, userID: req.cookies['user_id'] }
    res.redirect('/urls/')
  } else {
    res.redirect('/urls')
  }
});


///////////////////////
// --- ALL app.get/////
///////////////////////

// Renders a list of the urls
app.get("/urls", (req, res) => {
  //console.log(userDatabase[req.cookies['user_id']]['email'])
  // let userVal = "";
  // if ('undefined' !== typeof req.cookies['user_id']) {
  //   userVal = userDatabase[req.cookies['user_id']]['email'];
  // }
  //let userVal = isUserLoggedIn(req.cookies['user_id']);

  //FOR OLD URL DB
  //const templateVars = { urls: urlDatabase, user: userVal }; //ONLY SEND LIST OF URLS
  

  // FOR BASIC PERMISSION FEATURE
  // let formattedDatabase = {}
  // for (const key in urlDatabase) {
  //   formattedDatabase[key] = urlDatabase[key]['longURL'];
  // }

  let formattedDatabase = urlsForUser(req.cookies['user_id'])

  if (req.cookies['user_id']){
    const templateVars = { urls: formattedDatabase, user: req.cookies['user_id']  };
    res.render("urls_index", templateVars);
  } else {
    res.render('urls_index', {urls: "", user: ""})
  }

});

// Renders the new urls page where users can make a new URL
app.get("/urls/new", (req, res) => {
  //let userVal = isUserLoggedIn(req.cookies['user_id']);

  // if (userVal === "") {
  //   res.redirect('/login/')
  // }

  //console.log("Inside urls/new cookies: " + req.cookies['user_id'])
  if (req.cookies['user_id']){
    res.render("urls_new", { user: req.cookies['user_id'] });
  } else {
    res.redirect('/urls')
  }
});

// Confirmation page that shows short and long URL
app.get("/urls/:shortURL", (req, res) => {
  // userVal = isUserLoggedIn(req.cookies['user_id']);
  //console.log(req.cookies['user_id'])
  //FOR OLD URL DB
  //const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: userVal }; // REVISE TO ADD LONG URL
  
  //FOR BASIC PERMISSIONS
  //const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]['longURL'], user: userVal };
  //if (req.cookies['user_id'] === )
  
  if (urlDatabase[req.params.shortURL]['userID'] === req.cookies['user_id']) {
    let formattedDatabase = urlsForUser(req.cookies['user_id']);
    const templateVars = { shortURL: req.params.shortURL, longURL: formattedDatabase[req.params.shortURL], user: req.cookies['user_id'] };
    res.render("urls_show", templateVars);
  } else {
    res.redirect('/urls')
  }
});

// Goes to the long url page if we put in our shortUrl under /u/:shortURL
app.get("/u/:shortURL", (req, res) => {
  let shortKey = req.params.shortURL;

  //const longURL = urlDatabase[shortKey]; // REVISE TO READ ONLY LONG URL
  const longURL = urlDatabase[shortKey]['longURL'];
  res.redirect(longURL);
});

// Registration page
app.get("/register", (req, res) => {
  const templateVars = { };
  res.render("register", templateVars);
});

// Login page
app.get("/login", (req, res) => {
  const templateVars = { };
  res.render("login", templateVars);
});


//////////////////////////
// Connecting to server
//////////////////////////
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});