const express = require("express");
const app = express();
const PORT = 8080;
const uuidv1 = require("uuid/v1");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(
  cookieSession({
    name: "session",
    keys: ["Key1", "Key2"]
  })
);

var urlDatabase = {
  b2xVn2: {
    shortUrl: "b2xVn2",
    longUrl: "http://www.lighthouselabs.ca",
    userId: "userRandomID"
  },

  "9sm5xK": {
    shortUrl: "9sm5xK",
    longUrl: "http://www.google.com",
    userId: "user2RandomID"
  }
};

const usersDB = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "1234"
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },

  user3RandomID: {
    id: "user3RandomID",
    email: "marlon@example.com",
    password: "123abc"
  }
};

function generateRandomString() {
  return uuidv1().substring(0, 6);
}

const createUser = (email, password) => {
  const userId = generateRandomString();
  const newUser = {
    id: userId,
    email: email,
    password: password
  };
  usersDB[userId] = newUser;
  return userId;
};

const emailExist = email => {
  for (const userId in usersDB) {
    if (usersDB[userId].email === email) {
      return userId;
    }
  }
  return false;
};

function urlForUsers(id) {
  const filteredUrl = {};

  for (const shortUrl in urlDatabase) {
    const urlObj = urlDatabase[shortUrl];
    if (urlObj.userId === id) {
      filteredUrl[shortUrl] = urlObj;
    }
  }
  return filteredUrl;
}

function addNewUrl(shortUrl, longUrl, userId) {
  urlDatabase[shortUrl] = {
    shortUrl: shortUrl,
    longUrl: longUrl,
    userId: userId
  };
}

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  const userId = req.session["user_id"];
  let templateVars = {
    urls: urlForUsers(userId),
    user: usersDB[req.session.user_id]
  };

  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = { user: usersDB[req.session.user_id] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    longUrl: urlDatabase[req.params.id],
    shortUrl: req.params.id,
    user: usersDB[req.session.user_id]
  };
  res.render("urls_show", templateVars);
});

app.get("/login", (req, res) => {
  res.render("url_login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/u/:id", (req, res) => {
  const shortUrl = req.params.id;
  res.redirect(urlDatabase[shortUrl].longUrl);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.post("/urls", (req, res) => {
  const longUrl = req.body.longURL;
  const shortUrl = generateRandomString();
  const userId = req.session["user_id"];
  addNewUrl(shortUrl, longUrl, userId);
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.post("/urls/:id/update", (req, res) => {
  const shortUrl = req.params.id;
  const longUrl = req.body.longURL;
  if (req.session["user_id"] === urlDatabase[shortUrl].userId) {
    urlDatabase[shortUrl].longUrl = longUrl;
  }
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const email_password_empty = !email || !password;
  const hashedPassword = bcrypt.hashSync(req.body.password, 10); //

  if (email_password_empty) {
    res.status(400).send("please fill out the required field");
  } else if (emailExist(email)) {
    res.status(400).send("User already exist. Please Login!");
  } else {
    const userId = createUser(email, password);
    req.session.user_id = userId;
    res.redirect("/urls");
  }
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const passwordForm = req.body.password;
  const email_password_empty = !email || !passwordForm;
  const userIdDB = emailExist(email);
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  const compSync = bcrypt.compareSync(req.body.password, hashedPassword);

  if (email_password_empty) {
    res.status(403).send("Please fill out the required feild");
  } else if (!userIdDB) {
    res.status(403).send("wrong credentials!");
  } else {
    if (usersDB[userIdDB].password === passwordForm) {
      req.session.user_id = userIdDB;
      res.redirect("/urls");
    } else {
      res.status(400).send("wrong credentials!");
    }
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
