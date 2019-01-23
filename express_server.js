///__________________________FrameWork __________________________________________________________________________________________//
// express adds packages to build wed applications

const express = require("express");
const app = express(); // this means the application is running with express NPM
const PORT = 8080; // default port 8080
const uuidv1 = require("uuid/v1"); //feature to gen random number
//const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");

//__________________________MiddleWare__________________________________________________________________________________________//
//middle ware definition = define app endpoints(uri's)//sends response back to the client // matches request routes using pattern expressions.
//bodyParser - allowing you to extract
//set "View Engine" = set what kind of templete file to use (ex. html/ejs) this ex uses ejs
// MW - gives you an additon feature
const bodyParser = require("body-parser"); // installed npm body-parser and linked it
app.use(bodyParser.urlencoded({ extended: true })); //
app.set("view engine", "ejs"); // ejs engine
//app.use(cookieParser());
app.use(
  cookieSession({
    name: "session",
    keys: ["Key1", "Key2"]
  })
);

//__________________DataBase Object __________________________________________________________________________________________//
//This is where you are pulling info (check with mentor)
// When sending variables to an EJS template, you need to send them inside an object, even if you are only sending one variable
//URL DATABASE
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
//USERs DATABASE // task 3 w2d4 COMPASS
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
  //-Added as an example: Compass  asked to add one and see if you can login with it which you could
  user3RandomID: {
    id: "user3RandomID",
    email: "marlon@example.com",
    password: "123abc"
  }
};

//______________________________________Functions-Below___________________________________________________________________________//

//below function as indicated will give you a random string of 6 random alpha characters
function generateRandomString() {
  //1st step - new to create an id: // short URL
  return uuidv1().substring(0, 6);
  //console.log( "ID", id )
}

//--------------------1 Function-----Create Random User-----------------------------------//
const createUser = (email, password) => {
  // geerate a random id
  const userId = generateRandomString(); // function

  //create new user obj {
  //id: "user2RandomID",
  // email: "user2@example.com",
  //password: "dishwasher-funk"
  // }
  const newUser = {
    id: userId,
    email: email,
    password: password
  };
  // add a new user obj to the user db
  usersDB[userId] = newUser;
  return userId;
};

//-------------------------2 Function----emailExist----------------------------------//

//or const emailExist = email => {}
const emailExist = email => {
  //loop through the existing user obj
  for (const userId in usersDB) {
    //if the email is the same then i got the right user
    //then return the userId
    if (usersDB[userId].email === email) {
      return userId;
    }
  }
  return false;
  //maybe  later on i might change this function to check PW as well..we will see!
};

//________________________________3rd Function  -- urls for users_________________________________________________//

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

//________________________________4th Function  -- add new Url_________________________________________________//

function addNewUrl(shortUrl, longUrl, userId) {
  urlDatabase[shortUrl] = {
    shortUrl: shortUrl,
    longUrl: longUrl,
    userId: userId
  };
}

//__________________________________END POINTS - SHOW THE WORK "GET"__________________________________________________________________//
//Get =  route to show the form
//Render = "res.render" will send the OBJ we created to the EJS file (ex. "urls_index")
// struct = get / post / update / delete
app.get("/urls", (req, res) => {
  const userId = req.session["user_id"];
  //added the line above // this is what was there before let user = usersDB[req.session.user_id];
  let templateVars = {
    urls: urlForUsers(userId),
    user: usersDB[req.session.user_id]
  }; //2nd user is reffering to previous line

  res.render("urls_index", templateVars);
});
//___________________________
//adding a GET route to show form
app.get("/urls/new", (req, res) => {
  //let user = usersDB[req.cookies.user_id];

  let templateVars = { user: usersDB[req.session.user_id] };

  // give me the url_new (render below)
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    longUrl: urlDatabase[req.params.id],
    //long url is trying to access  the [] in this ex. "http://www.lighthouselabs.ca"
    //[] = OBJECT [key] returns value- "http://...""
    shortUrl: req.params.id,
    user: usersDB[req.session.user_id]
  };
  //[ req.params.id ] -- gives you back the id within the obj indicated before
  //console.log( urlDatabase[req.params.id ] )
  res.render("urls_show", templateVars);
});
//login --------> get------> show the login page
//logout -------->get------> show the logout page
//register ------>get------> show me the register page
//------End point for managing the login

app.get("/login", (req, res) => {
  //render to login
  res.render("url_login");
});

//-----------register endpoint ----------

app.get("/register", (req, res) => {
  // add let templateVar = {user:null} this could work instead of the type of on ejs "header"
  res.render("register");
  //NEED TO ADD SOMETHING HERE FROM VIDEO // line 186/ line
});

//____________________________________________________________________________________//
//____________________________________________________________________________________//
//____________________________________________________________________________________//

/*NOT IN USE RIGHT NOW
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
*/
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//____________________________POST END POINTS (add/delete/update)(ALL THE POSTS DO THE WORK)_____________________________________//

app.post("/urls", (req, res) => {
  // let rNumber = generateRandomString();
  // urlDatabase[rNumber] = req.body.longURL;

  //-----DOMS EX.
  //Dom used the below two which are the same as the above two
  const longUrl = req.body.longURL;
  const shortUrl = generateRandomString();

  const userId = req.session["user_id"];
  //const userId = req.session.user_Id;
  addNewUrl(shortUrl, longUrl, userId);
  //--------------------
  res.redirect("/urls"); // redirect you back to the home page. (ex "/url = home page ")
});

app.post("/urls/:id/delete", (req, res) => {
  // Routing To Server -ex
  delete urlDatabase[req.params.id]; //
  res.redirect("/urls"); // redirect you back to the home page. (ex "/url = home page ")
});

app.post("/urls/:id/update", (req, res) => {
  //
  //this function all it does is update the link "update"//
  //extraxt info from url ID
  const shortUrl = req.params.id;
  // extract info from the form being submitted
  const longUrl = req.body.longURL;
  //update the url in your URL-DB then redirect
  urlDatabase[shortUrl].longUrl = longUrl;

  //its going to find the obj URL DB and replace its value by (longUrl)
  //redirect
  res.redirect("/urls");
  //THIS TASK IS DOING BELOW:
  // This portion of the assignment requires changes on the client and the server.
  // Once the user submits an Update request, it should modify the corresponding
  // longURL, and then redirect the client back to "/urls".
});

app.post("/register", (req, res) => {
  //task 4 -- w2d4 COMPASS (user registration handler)
  // add user to database/ tag you /redirect to hompage)
  const email = req.body.email;
  const password = req.body.password;
  const email_password_empty = !email || !password;
  const hashedPassword = bcrypt.hashSync(req.body.password, 10); //
  console.log(hashedPassword);
  // If the e-mail or password are empty strings, send back a response with the 400 status code.
  // If someone tries to register with an existing user's email, send back a response with the 400 status code.

  if (email_password_empty) {
    // Task 5 w2d4 COMPASS
    res.status(400).send("please fill out the required field");
  } else if (emailExist(email)) {
    res.status(400).send("User already exist. Please Login!");
  } else {
    const userId = createUser(email, password);

    //set the cookie with the userId
    req.session.user_id = userId;
    // res.redirect to /urls
    res.redirect("/urls");
    // check the brower via dev mode under application to see if this works
  }
});

app.post("/login", (req, res) => {
  //this line verifys credentials reroute to hompage and tag you "stamp" (if valid login).
  // It should set a cookie named username to the value submitted in the request body via the login form.
  //const userName = req.body.email;
  const email = req.body.email;
  const passwordForm = req.body.password;
  const email_password_empty = !email || !passwordForm;
  const userIdDB = emailExist(email);
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  const compSync = bcrypt.compareSync(req.body.password, hashedPassword);
  console.log(compSync);

  if (email_password_empty) {
    // Task 5 w2d4 COMPASS
    res.status(403).send("Please fill out the required feild");
  } else if (!userIdDB) {
    // if no email please redirect to error msg
    res.status(403).send("wrong credentials!");
  } else {
    //now that we know email exist you need to compare PW
    if (usersDB[userIdDB].password === passwordForm) {
      // or req.body.password:
      req.session.user_id = userIdDB;
      // res.redirect to /urls
      res.redirect("/urls"); //After your server has set the cookie it should redirect the browser back to the /urls page.

      // check the brower via dev mode under application to see if this works
    } else {
      res.status(400).send("wrong credentials!");
    }
  }
});

app.post("/logout", (req, res) => {
  // it will wash your stamp off (remove the stamp) //TASK7-W2D2
  //remove the cookie from the user ID
  req.session = null;
  res.redirect("/urls");
});

//_______________________________________________________________________________________________________________//

// 1 EXAmPLE-
// app.post( "/edit", ( req, res ) =>
// {
//     UserName = req.cookies;
//     //console.log( req.body );  // debug statement to see POST parameters
//     urlDatabase[ rNumber ] = req.body.longURL;
//     console.log( urlDatabase )
//     res.redirect( '/urls' ); // redirect you back to the home page. (ex "/url = home page ")
// } );

// app.get( '/login', function ( req, res )
// {
//     const userId = req.cookie.userId
//     const currentUser = urlDatabase[ userId ]

// } )

//____________________________________________________________________________________//
//____________________________________________________________________________________//

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// post request --

//_______________________QUESTIONS____________________________________//
//In Express, when an EJS template is rendered using res.render(), the EJS is evaluated on the server or client?
//ANSWER: On the server, before the HTTP response gets sent to the client
//________although possible to render client-side templates, we use it as a
//________server-side technology. ALSO /Either server or client, but it's predominantly found server-side
//________although possible to render client - side templates with EJS, that is not how we will be using it

//Q2-How are Arrow Functions () => {} different than traditional function expressions?
//ANWSER - arrow functions inherit parent scope // they do no declare the functions

//Q3 - Considering the following JavaScript code, what will the console output be and why?
//ANSWER:
// function foo() {
//     var x = 1;
//     if (x === 1) {
//       let y = 2;
//     }
//     console.log('Value of y is ' + y);
//   }
//   foo();
//ANSWER : ReferenceError
//the block-scoping of let y = 2 makes it available only within the if statement block

//Q4 - Consider the following JavaScript code, what would be the console output?
//ANSWER:
// const names = ['Graham'];
// names = [];
// console.log(names)
//Console would show a TypeError----Assignment to constant variable. due to the declaration using const

//Q5 - Given the following JavaScript code, what would be the console output?
//
//ANSWER:
// const names = [];
// names.push('Jordan');
// console.log( names );
//Console would show ['Jordan'] -it still allows us to change the value of the referenced variable
//TASK 6//
//same principle for the rest
//curl -X POST "http://localhost:8080/urls/9sm5xK/delete"
