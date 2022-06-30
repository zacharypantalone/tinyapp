const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const generateRandomString = () => {
  let characters = 'abcdefghijklmnopqrstuvwxyz';
  let string = "";
  
  for (let i = 0; i < characters.length; i++) {
    string += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return string.slice(0, 8);
};


    
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};
  
//\/\/\/THIS IS ONLY STARTER CODE\/\/\/////////
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
//^^^THIS IS ONLY STARTER CODE^^^////////
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});




app.get("/urls", (req, res) => {
  const userID = req.cookies.userID;
  
  // if (!userID) {
  //   res.send('not logged in!');
  //   return;
  // }
  const user = users[userID];
  console.log(req.cookies);
  const templateVars = { urls: urlDatabase, user };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.cookies["userID"]] };
  res.render("urls_new", templateVars);
});


app.get("/register", (req, res) => {
  
  const templateVars = { user: null };
  
  res.render("register", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = {
    shortURL,
    longURL,
    user: users[req.cookies["userID"]]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});





app.post("/urls", (req, res) => {
  
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});


app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls");
});

app.post("/login", (req, res) => {

});

app.post("/logout", (req, res) => {
  res.clearCookie("userID");
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const id = generateRandomString();
  
  users[id] = { id, email, password };


  if (!email || !password) {
    res.status(400).send('Error code 400');
    
  }

  if (users[email]) {
    res.status(400).send('user already exists');
    
  }
  
  res.cookie('userID', id);
  res.redirect('/urls');
 
});
  

  
  

