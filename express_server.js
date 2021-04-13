const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.use(bodyParser.urlencoded({extended: true}));
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

// Local object database for short and corresponding long urls
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });


// Renders a list of the urls
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});



// Renders the new urls page where users can make a new URL
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


// Generates a random short URL and goes to a confirmation page on the redirect
app.post("/urls", (req, res) => {
  let inputSite = req.body.longURL;
  let shortString = generateRandomString();
  urlDatabase[shortString] = inputSite;
  console.log(urlDatabase)
  res.redirect("/urls/"+shortString)
});

// Confirmation page that shows short and long URL
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

// Goes to the long url page if we put in our shortUrl under /u/:shortURL
app.get("/u/:shortURL", (req, res) => {
  let shortKey = req.params.shortURL;
  const longURL = urlDatabase[shortKey];
  res.redirect(longURL);
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

// Connecting to server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});