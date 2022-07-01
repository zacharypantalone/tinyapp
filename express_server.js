const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require("bcryptjs");
const emailLookup = require('./helpers.js');
// const password = "purple-monkey-dinosaur";
// const hashedPassword = bcrypt.hashSync(password, 10);
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ["key1", "key2"],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));




    


const users = {
  "userRandomID":
  {id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"},
  "user2RandomID":
  {id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"}
};

const urlDatabase = {
  b2xVn2: {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "user2RandomID"
  }
};

///////// HELPER FUNCTIONS///////////////////////////


const urlsFilter = (userID) => {
  const newObject = {};

  for (const key in urlDatabase) {
    const urlObject = urlDatabase[key];

    if (urlObject.userID === userID) {
      newObject[key] = urlObject;
    }
  }
  return newObject;
};

const generateRandomString = () => {
  let characters = 'abcdefghijklmnopqrstuvwxyz';
  let string = "";
  
  for (let i = 0; i < characters.length; i++) {
    string += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return string.slice(0, 8);
};

////////// HELPER FUNCTIONS/////////////////////////
  
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

///////////GETS/////////////////////////////////////

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const userID = req.session.userID;
  const user = users[userID];
  
  
  const templateVars = { urls: urlsFilter(req.session.userID), user };
  res.render("urls_index", templateVars);
});
  

app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.session.userID] };
  res.render("urls_new", templateVars);
});


app.get("/register", (req, res) => {
  const templateVars = { user: null };
  
  res.render("register", templateVars);
});
  

app.get("/login", (req, res) => {
  const templateVars = { user: null };
  
  res.render("login", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = {
    shortURL,
    longURL,
    user: users[req.session.userID]
  };

  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];

  if (!longURL) {
    res.status(404).send('Short URL not found');
  }
  
  res.redirect(longURL.longURL);
});

/////////////POSTS///////////////////////////////////

app.post("/urls", (req, res) => {
  
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.session.userID
  };
  
  res.redirect(`/urls/${shortURL}`);
});


app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;

  urlDatabase[shortURL].longURL = longURL;
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const id = emailLookup(users, email);

  if (!id) {
    res.status(403).send('Account does not exist.');
    return;
  }

  if (!bcrypt.compareSync(password, users[id].password)) {
    res.status(403).send("Invalid password.");
    return;
  }
  
  req.session.userID = id;
  res.redirect('/urls');
});

app.post("/logout", (req, res) => {

  req.session = null;
  res.redirect("/urls");
});
  
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).send('Error code 400');
    return;
  }

  if (emailLookup(users, email)) {
    res.status(400).send('user already exists');
    return;
  }
  
  const id = generateRandomString();
  users[id] = { id, email, password: bcrypt.hashSync(password, 10) };
  
  
  req.session.userID = id;
  res.redirect('/urls');
});











 
  

  
  



 



  
  

  
  

